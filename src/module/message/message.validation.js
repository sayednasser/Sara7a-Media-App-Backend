import Joi from "joi";
import { generalValidationFields } from "../../common/index.js";



export const messageValidation = {
    body: Joi.object({
        content: Joi.string().allow("").optional(),
        attachment: generalValidationFields.File,
    }),
    params: Joi.object({
        receiverId: Joi.string().required(),

    })


}


export const getMessage = {
    params: Joi.object({
        messageId: Joi.string().required(),  

    })
}