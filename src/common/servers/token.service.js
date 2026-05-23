import jwt from "jsonwebtoken"
import { ACCESS_EXPIRES_IN, REFRESH_EXPIRES_IN, SYSTEM_ACCESS_TOKEN_KEY, SYSTEM_REFRESH_TOKEN_KEY, USER_ACCESS_TOKEN_KEY, USER_REFRESH_TOKEN_KEY } from "../../../config/config.js"
import { audienceEnum, RoleEnum, TokenTypeEnum } from "../Enum/index.js"
import { BadRequestError, UnauthorizedError } from "../exception/application.exception.js"
import { userModel } from "../../DB/model/userModel.js"
import { randomUUID } from "node:crypto"
import { get, revokeTokenBaseKey } from "../servers/redis.service.js"
export const generateToken = async ({ payload = {}, secret = USER_ACCESS_TOKEN_KEY, option = {} } = {}) => {
    return await jwt.sign(payload, secret, option)
}
export const verifyToken = async ({ token, secret }) => {
    return await jwt.verify(token, secret)
}


export const getTokenSignature = async (role) => {
    let accessSignature;
    let refreshSignature;
    let audience = audienceEnum.User;
    switch (role) {
        case RoleEnum.Admin:
            accessSignature = SYSTEM_ACCESS_TOKEN_KEY
            refreshSignature = SYSTEM_REFRESH_TOKEN_KEY
            audience = audienceEnum.System
            break;
        default:
            accessSignature = USER_ACCESS_TOKEN_KEY
            refreshSignature = USER_REFRESH_TOKEN_KEY
            audience = audienceEnum.User
            break;
    }
    return { accessSignature, refreshSignature, audience }

}
export const createLoginCredentials = async (user, issuer) => {
    const jwtId=randomUUID()

    const { accessSignature, refreshSignature, audience } = await getTokenSignature(user.role)
    console.log("user:", user);
    console.log("user._id:", user._id);
    const access_token = await generateToken({
        payload: { sub: user._id },
        secret: accessSignature,
        option: {
            issuer,
            expiresIn: ACCESS_EXPIRES_IN,
            audience: [TokenTypeEnum.access, audience],
            jwtid: jwtId

        }
    })
    const refresh_token = await generateToken({
        payload: { sub: user._id },
        secret: refreshSignature,
        option: {
            issuer,
            expiresIn: REFRESH_EXPIRES_IN,
            audience: [TokenTypeEnum.refresh, audience],
            jwtid: jwtId
        }
    })
    return { access_token, refresh_token }


}

export const getSignatureLevel = async (audienceType) => {
    let signatureLevel;
    switch (audienceType) {
        case audienceEnum.System:
            signatureLevel = RoleEnum.Admin
            break;
        default:
            signatureLevel = RoleEnum.User
            break;
    }
    return signatureLevel
}

export const decodeToken = async ({ token, tokenType = TokenTypeEnum.access } = {}) => {

    const decode= await jwt.decode(token)

    if (!decode?.aud?.length) {
        throw BadRequestError({ message: `failed to decode token and token is required` })
    }


    if ( decode.jti && await get(revokeTokenBaseKey({ userId: decode.sub, jti: decode.jti })) ) {
        throw BadRequestError({ message: `invalid login seisson` })
        
    }
    const [decodedTokenType, audienceType] = decode.aud
    if (decodedTokenType !== tokenType) {
        throw BadRequestError({ message: `invalid token Type  toen type of ${decodedTokenType}  cannot access this api while token type of ${tokenType}` })

    }
    const signatureLevel = await getSignatureLevel(audienceType)
    const { accessSignature, refreshSignature } = await getTokenSignature(signatureLevel)
    const verifyData = await verifyToken({
        token,
        secret: tokenType == TokenTypeEnum.refresh ? refreshSignature : accessSignature
    })
    console.log({ sub: verifyData.sub });
    const user = await userModel.findOne({ _id: verifyData.sub })
    if (!user) {
        throw UnauthorizedError({ message: "user not found please signup first" })
    }
    if (user.changeCredentialsTime && user.changeCredentialsTime?.getTime() > decode.iat*1000) {

        throw UnauthorizedError({ message: "user credentials changed please login again" })
        
    }
    return {user,decode}






}


