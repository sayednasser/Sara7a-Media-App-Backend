import joi from "joi"
import { filedValidation, generalValidationFields } from "../../common/index.js";


export const shareProfile = {
    params: generalValidationFields.id.required()
};
export const profileImage = {
    file: generalValidationFields.File(filedValidation.image).required()
};
export const coverImage = {
    files: joi.array().items(generalValidationFields.File(filedValidation.image)).min(1).max(2)
}

export const updatePassword = {
    body: joi.object({
        oldPassword: generalValidationFields.password.required(),
        newPassword: generalValidationFields.password.required(),
        confirmPassword: generalValidationFields.password.required()
    })
}
export const updateProfile = {
    body: joi.object({
        email: generalValidationFields.email,
         firstName:
            joi.string().min(2).max(20),

        lastName:
            joi.string().min(2).max(20),

        phone:
            joi.string(),
             bio:
            joi.string(),
 
        gender: 
            joi.number(),

    }).required(),
    params: joi.object().keys({
    }
    ).required(),
}