import { hash, compare } from "bcrypt"
import { SALT_ROUND } from "../../../../config/config.js"
const SALt = SALT_ROUND

export const generateHash = async ({ plainText, salt = SALt }) => {
    if (!plainText) throw new Error("plainText is required")
    console.log({ SALt });


    return await hash(plainText, salt)

}
export const compareHash = async ({ plainText, hashText }) => {
    console.log("Data:", plainText);
    console.log("Hash:", hashText);
    return await compare(plainText, hashText)
}
 