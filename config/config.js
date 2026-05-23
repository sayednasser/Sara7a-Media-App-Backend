import { resolve } from "node:path"
import { config } from "dotenv";
config({ path: resolve(`config/.env.${process.env.NODE_ENV || 'development'}`) })
export const PORT = process.env.PORT
export const DB_URL = process.env.DB_URL
export const REDIS_URL = process.env.REDIS_URL
export const USER_ACCESS_TOKEN_KEY = process.env.USER_ACCESS_TOKEN_KEY
export const SYSTEM_ACCESS_TOKEN_KEY = process.env.SYSTEM_ACCESS_TOKEN_KEY
export const USER_REFRESH_TOKEN_KEY = process.env.USER_REFRESH_TOKEN_KEY
export const SYSTEM_REFRESH_TOKEN_KEY = process.env.SYSTEM_REFRESH_TOKEN_KEY
export const SALT_ROUND = Number(process.env.SALT_ROUND)
export const ACCESS_EXPIRES_IN = parseInt(process.env.ACCESS_EXPIRES_IN)
export const REFRESH_EXPIRES_IN = parseInt(process.env.REFRESH_EXPIRES_IN)
export const FACEBOOK = process.env.FACEBOOK
export const INSTAGRAM = process.env.INSTAGRAM
export const YOUTUBE = process.env.YOUTUBE
export const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD
export const EMAIL_APP = process.env.EMAIL_APP
export const WEB_CLIENT_ID = process.env.WEB_CLIENT_ID
export const Cloud_name = process.env.CLOUD_NAME
export const Api_key = process.env.CLOUD_API_KEY
export const Api_secret = process.env.CLOUD_SECRET
export const ORIGIN = process.env.ORIGIN