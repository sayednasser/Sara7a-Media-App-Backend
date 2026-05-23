import { redisClient } from "../../DB/redis.connection.js"
import { emailEnum } from "../utils/email/email.enum.js"
export const revokeTokenBaseKey = (userId) => {
    return `RevokeToken::${userId.toString()}::`
}
export const revokeToken = ({ userId, jti } = {}) => {
    return `${revokeTokenBaseKey(userId)}${jti}::`
}
export const otpKey =  ({ email, subject = emailEnum.confirmEmail } = {}) => {
    return  `::User::otp::${email}::${subject}`
} 
export const maxAttemptOtpKey = ({ email, subject = emailEnum.confirmEmail } = {}) => {
    return `${otpKey({ email, subject })}::maxTrial`
}
export const blockOtpKey = ({ email, subject = emailEnum.confirmEmail } = {}) => {
    return `${otpKey({ email, subject })}::blocked`
}
export const login = ({ email, password }) => {
    return `Email::${email}::${password}`
}
export const maxLoginAttempt = ({ email, password }) => {
    return `${login({ email, password })}::maxTrial login`
}
export const blockLogin = ({ email, password }) => {
    return `${login({ email, password })}::blocked login`
}
export const set = async ({ key, value, ttl } = {}) => {
    try {
        let data = typeof value === "string" ? value : JSON.stringify(value)

        return ttl ? await redisClient.set(key, data, { ttl }) : await redisClient.set(key, data)
    } catch (error) {
        console.log(`failed to set this operation`);
    }
}
export const get = async (key) => {
    try {
        let data = await redisClient.get(key)
        try {
            return data.parse(data)
        } catch (error) {
            return data

        }

    } catch (error) {
        console.log(`failed to get this operation ${error}`);
    }
}
export const delKey = async (key = []) => {
    try {
        return await redisClient.del(...key)
    } catch (error) {
        console.log(`failed to delete this operation`);
    }
}
export const expire = async (key, ttl) => {
    try {
        const result = await redisClient.expire(key, ttl)
        return result === 1
    } catch (error) {
        console.log(`failed to expire this operation`);
        return false
    }
}
export const mGet = async (keys) => {
    try {
        if (!keys.length) {
            return 0

        }
        await redisClient.mget(keys)
    } catch (error) {
        console.log(` failed to mGetKey error`);
        return -2


    }
}
export const updata = async ({ key, value, ttl } = {}) => {
    try {
        if (! await redisClient.exists(key)) {
            return 0
        }
        return await redisClient.set({ key, value, ttl })
    } catch (error) {
        console.log(`failed to updata this operation`);
    }
}
export const incr = async (keys) => {
    try {
        await redisClient.incr(keys)
    } catch (error) {
        console.log(`failed to increment key`);


    }
}
export const ttl = async (key) => {
    try {
        await redisClient.ttl(key)
    } catch (error) {
        console.log(`failed to ttl this operation`);


    }
}
export const keys = async (key) => {
    try {
        await redisClient.keys({ key })

    } catch (error) {
        console.log(`failed to key this operation`);


    }
}