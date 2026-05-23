import crypto from "node:crypto"
const IV_LENGTH = 16
const ENCRYPTION_SECRET_KEY = '01234567899876543210000123456789'

export const encrypt = async(text) => {
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_SECRET_KEY, iv)
    let encryption = cipher.update(text, 'utf-8', 'hex')
    encryption += cipher.final('hex')
    return `${iv.toString('hex')}:${encryption}`
}

export const decrypt=async(encrypted)=>{
    if(!encrypted){
        throw new Error("invalid encrypted data")
    }
const [iv,encryption]=encrypted.split(":")
 if (!iv || !encryption) {
    throw new Error("Invalid encrypted format");
  }
const binaryLikeIv=Buffer.from(iv,'hex')
    const decipher= crypto.createDecipheriv('aes-256-cbc',ENCRYPTION_SECRET_KEY,binaryLikeIv)
    let decryption=decipher.update(encryption,'hex','utf-8');
    decryption += decipher.final('utf-8')
    return decryption

}