import joi from "joi"
import { Types } from "mongoose"

export const generalValidationFields = {
    email: joi.string().email({ minDomainSegments: 2, maxDomainSegments: 3, tlds: { allow: ['com', 'net', 'edu'] } }),
    password: joi.string().pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).{8,16}$/),
    userName: joi.string().pattern(new RegExp(/^[A-Z]{1}[a-z]{1,24}\s[A-Z]{1}[a-z]{1,24}$/)),
    otp: joi.string().pattern(new RegExp(/^\d{6}$/)),
    confirmPassword: (filedPass) => joi.string().valid(joi.ref(filedPass)).required(),
    phone: joi.string().pattern(new RegExp(/^(02|2|\+2)?01[0-25]\d{8}$/)),
    role: joi.number(),
    bio:joi.string().max(250),
    FCM: joi.string(),
    gender:joi.number(),
    age: joi.number().positive().integer(),
    id: joi.string().custom((value, helper) => {
        return Types.ObjectId.isValid(value) ? true : helper.message("invalid objectId")
    }),
    File: function (mimetype = []) {
        return joi.object().keys({
            fieldname: joi.string(),
            originalname: joi.string(),
            encoding: joi.string(),
            mimetype: joi.string().valid(...mimetype),
            destination: joi.string(),
            filename: joi.string(),
            path: joi.string(),
            buffer: joi.any(),
            size: joi.number().positive()
        })

    }
}