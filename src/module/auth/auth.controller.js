import Router from "express";
import { confirmEmail, forgetPassword,  googleLoginAndSignup, login, resendEmail, resetForgotPassword, signup, verifyEmail } from "./auth.service.js";
import { successRequest } from "../../common/index.js";
import { authentication, validation } from "../../middleware/index.js";
import * as validators from "./auth.validation.js"
const router = Router()
router.post("/signup", validation(validators.signup), async (req, res, next) => {
    const account = await signup(req.body)
    successRequest({ res, data: account })
})
router.patch("/confirm-Email", validation(validators.confirmEmail), async (req, res, next) => {
    const account = await confirmEmail(req.body)
    successRequest({ res })
})
router.patch("/resend-Confirm-Email", validation(validators.resendEmail), async (req, res, next) => {
    const account = await resendEmail(req.body)
    successRequest({ res })
})
router.patch("/forgot-password", validation(validators.resendEmail), async (req, res, next) => {
    const account = await forgetPassword(req.body)
    successRequest({ res })
})
router.patch("/verify-forgot-password", validation(validators.confirmEmail), async (req, res, next) => {
    const account = await verifyEmail(req.body)
    successRequest({ res })
})
router.patch("/reset-forgot-password", validation(validators.forgetPassword), async (req, res, next) => {
    const account = await resetForgotPassword(req.body)
    successRequest({ res })
})
router.post("/login",validation(validators.login), async (req, res, next) => {
    const account = await login(req.body, `${req.protocol}://${req.host}`)
    successRequest({ res, data: account })
})  

router.post("/google-signup-and-login", async (req, res, next) => {

    const {credential,isNew,message} = await googleLoginAndSignup(req.body,`${req.protocol}://${req.host}`)
    successRequest({ res,data:{credential},status:isNew?201:200,message}) })
export default router   
           