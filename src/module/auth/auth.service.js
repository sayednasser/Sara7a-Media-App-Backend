import { createClient } from "redis"
import { compareHash, conflictRequestError, generateHash, encrypt, RoleEnum, createLoginCredentials, ttl,  BadRequestError, otpKey, get, maxAttemptOtpKey, set, ErrorException, incr, NotFoundException, providerEnum, delKey, maxLoginAttempt, blockLogin, UnauthorizedError, keys, revokeTokenBaseKey ,blockOtpKey} from "../../common/index.js"
import { emailEnum } from "../../common/utils/email/email.enum.js"
import { userModel } from "../../DB/model/userModel.js"
import { createCodeOtp, emailTemplate } from "../../common/utils/email/templateEmail.js"
import { sendEmail } from "../../common/utils/email/sendEmail.js"
import { OAuth2Client } from 'google-auth-library';
import { WEB_CLIENT_ID } from "../../../config/config.js"
import { emailEvent } from "../../common/index.js"


const sendEmailOtP = async ({ email, subject, title } = {}) => {

  const isBlocked = await ttl(blockOtpKey({ email, subject }))
  if (isBlocked > 0) {
    throw ConflictErrorException({ message: `Sorry we cannot send new otp before you wait ${isBlocked}` });
  }

  const resendingTime = await ttl(otpKey({ email, subject }))
  if (resendingTime > 0) {
    throw ConflictErrorException({ message: `Sorry we cannot resend new otp until exist otp expire ${resendingTime}` });
  }
  const maxTrial = await get(maxAttemptOtpKey({ email, subject }))
  if (maxTrial >= 3) {
    await set({
      key: blockOtpKey({ email, subject }),
      value: 1,
      ttl: 420
    })
    throw ErrorException({ message: "yau reached to max place wait " })
  }

  const code = await createCodeOtp()
  await set({
    key: otpKey({ email, subject }),
    value: await generateHash({ plainText: `${code}` }),
    ttl: 120
  })
  emailEvent.emit("sendEmail", async () => {
    await sendEmail({
      to: email,
      subject,
      html: await emailTemplate({ code, title })
    })
    await incr(maxAttemptOtpKey({ email, subject }))
  }

  )
}

export const signup = async (inputs) => {
    const { email, userName, password, role, age, phone, gender } = inputs
    const checkAccount = await userModel.findOne({ email })
        if (checkAccount) {
        throw conflictRequestError({ message: "email already exists" })
    }
    const account = await userModel.create({
        userName,
        email,
        password: await generateHash({ plainText: password }),
        phone: await encrypt(phone),
        role,
        age,
        gender})
    try {
        await sendEmailOtP({ email, subject: emailEnum.confirmEmail, title: "verifyEmail" })
    } catch (error) {
        console.error("Failed to send OTP email:", error);
 
    }

    return account
}
export const confirmEmail = async (inputs) => {
    const { email, code } = inputs
    const hashOtp = await get(otpKey({ email, subject: emailEnum.confirmEmail }))
    if (!hashOtp) {
        throw BadRequestError({ message: "otp expired" })
    }
    const checkAccount = await userModel.findOne({ email, provider: providerEnum.System, confirmEmail: { $exists: false } })
    if (!checkAccount) {
        throw NotFoundException({ message: "user not found or is confirmed" })
    }
    console.log({ hashOtp, code });
    if (!await compareHash({ plainText: code, hashText: hashOtp })) {
        throw conflictRequestError({ message: "invalid otp" })
    }
    checkAccount.confirmEmail = new Date()
    await checkAccount.save()
    await delKey(otpKey({ email, subject: emailEnum.confirmEmail }))
    return;
}
export const resendEmail = async (inputs) => {
    const { email } = inputs

    const checkAccount = await userModel.findOne({ email, provider: providerEnum.System })
    if (!checkAccount) {
        throw NotFoundException({ message: "user not found " })
    } 
    return await sendEmailOtP({ email, title: 'verifyEmail' })
} 
export const forgetPassword = async (inputs) => {
    const { email } = inputs
    const checkAccount = await userModel.findOne({ email, provider: providerEnum.System, confirmEmail: { $exists: true } })
    if (!checkAccount) {
        throw NotFoundException({ message: "User Not found" })
    }
    return await sendEmailOtP({ email, subject: emailEnum.forgotPassword, title: "rest forget password" })
}
export const verifyEmail = async (inputs) => {
    const { email, otp } = inputs
    const hashOtp = await get(otpKey({ email, subject: emailEnum.forgotPassword }))
    console.log("HASH OTP =>", hashOtp)
    
    if (!hashOtp) {
            throw BadRequestError({ message: "otp expired" })
        }

        if (!await compareHash({ plainText: otp, hashText: hashOtp })) {
            throw conflictRequestError({ message: "invalid otp" })
        } 
        return; 
    } 
    export const resetForgotPassword = async (inputs) => {
        const { email, otp, password } = inputs
        await verifyEmail({ email, otp })
        const user = await userModel.findOne({ email, confirmEmail: { $exists: true }, provider: providerEnum.System })
        if (!user) {
            throw NotFoundException({ message: "User Not found" })
        }
        await userModel.updateOne({ email, confirmEmail: { $exists: true }, provider: providerEnum.System }, { password: await generateHash({ plainText: password }), changeCredentialTime: new Date() })
        const tokens = await keys(revokeTokenBaseKey({ user: user._id }))
        const OtpKey = await keys(otpKey({ email, subject: emailEnum.forgotPassword }))
        await delKey({...tokens, ...OtpKey
        }
        )
        return;
    }
    export const login = async (inputs, issuer) => {
        const { email, password } = inputs
        const user = await userModel.findOne({ email, confirmEmail: { $exists: true }, provider: providerEnum.System })
        if (!user) {
            throw NotFoundException({ message: "invalid login credentials" })
        }
        const isBlocked = await ttl(blockLogin({ email }))
        if (isBlocked > 0) {
            throw conflictRequestError({ message: `you reached max attempt please try again after ${isBlocked} seconds` })
        }
        const result = await compareHash({ plainText: password, hashText: user.password })
        if (!result) {
            const maxTrial = await incr(maxLoginAttempt({ email }))
            if (maxTrial >= 5) {
                await set({ keys: blockLogin({ email }), value: 1, ttl: 300 })
            }
            throw UnauthorizedError({ message: "invalid login credentials" })
        }
        return await createLoginCredentials(user, issuer)
    }
    async function verify(idToken) {
        const client = new OAuth2Client();
        const ticket =
            await client.verifyIdToken({
                idToken,
                audience: WEB_CLIENT_ID,
            });

        const payload = ticket.getPayload();
        return payload
    }
    export const googleLoginAndSignup = async (inputs = {}, issuer) => {
        const { idToken } = inputs
        const payload = await verify(idToken)
        if (!payload.email_verified) {
            throw BadRequestError({ message: "email is not verified" })
        }
        const user = await userModel.findOne({ email: payload.email })
        if (user) {
            if (user.provider === providerEnum.google) {
                return { credential: await createLoginCredentials(user, issuer), isNew: false, message: "Login successful" }
            }
            throw conflictRequestError({ message: "email already exists, please login with google" })
        }
        const newUser = await userModel.create({
            email: payload.email,
            firstName: payload.given_name, 
            lastName: payload.family_name,
            provider: providerEnum.google,
            confirmEmail: new Date(),
        })
        await newUser.save()
        const credential = await createLoginCredentials(newUser, issuer)
        return { credential, isNew: true, message: "Account created successfully" }

    } 










