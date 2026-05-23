import joi from "joi";
import { generalValidationFields } from "../../common/index.js";

export const login = {
    body: joi.object().keys({
        email: generalValidationFields.email.required(),
        password: generalValidationFields.password.required(),
        FCM: generalValidationFields.FCM
    }).required()

}
export const signup = {
    body: login.body.append({
        userName: generalValidationFields.userName.required(),
        confirmPassword: generalValidationFields.confirmPassword("password").required(),
        phone: generalValidationFields.phone,
        role: generalValidationFields.role,
        age: generalValidationFields.age,
        gender:generalValidationFields.gender,
        bio: generalValidationFields.bio

    }).required(),
    params: joi.object().keys({
    } 
    ).required(),

 
}
export const updateProfile = {
    body: login.body.append({
        userName: generalValidationFields.userName.required(),
        phone: generalValidationFields.phone,
        role: generalValidationFields.role,
        age: generalValidationFields.age

    }).required(),
    params: joi.object().keys({
    }
    ).required(),
}
export const resendEmail = {
    body: joi.object().keys({
        email: generalValidationFields.email,
    }).required()
}
export const confirmEmail = {
    body: resendEmail.body.append({
        code: generalValidationFields.otp
    }).required()
} 
export const forgetPassword = {
    body: resendEmail.body.append({
        otp: generalValidationFields.otp,
        password: generalValidationFields.password,
        confirmPassword: generalValidationFields.confirmPassword("password").required(),

    }).required()
}  
 
