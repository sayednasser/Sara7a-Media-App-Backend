import { BadRequestError, decodeToken, TokenTypeEnum } from "../common/index.js"


export const authentication = (tokenType = TokenTypeEnum.access) => {
    return async (req, res, next) => {
        if (!req?.headers?.authorization) {
            throw BadRequestError({ message: "missing authorization key" })
        }
        const { authorization } = req.headers
        const [flag, credentials] = authorization.split(" ")
        if (!flag || !credentials) {
            throw BadRequestError({ message: 'missing author' })
        }
        switch (flag) {
            case 'Bearer':
                const { user, decode } = await decodeToken({ token: credentials, tokenType })
                req.user = user;
                req.decode = decode;
                break;
            default:
                break;
        }
        next()
    }

}
export const authorization = (accessRole = []) => {
    return async (req, res, next) => {
        if (!accessRole.includes(req.user.role)) {
            throw BadRequestError({ message: "not allowed to access" })
        }

        next()
    }

}    