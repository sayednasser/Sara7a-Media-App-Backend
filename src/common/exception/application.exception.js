
export const ErrorException = ({ message = 'ErrorException', status = 400, extra = undefined } = {}) => {
    throw new Error(message, { cause: { status, extra } })
}
export const NotFoundException = ({ message = 'NotFoundException', status = 404, extra = undefined } = {}) => {
    throw new Error(message, { cause: { status, extra } })
}

export const conflictRequestError = ({ message = 'conflictRequestError', status = 409, extra = undefined } = {}) => {
    throw new Error(message, { cause: { status, extra } })
}

export const BadRequestError = ({ message = 'BadRequestError', status = 400, extra = undefined } = {}) => {
    throw new Error(message, { cause: { status, extra } })
}

export const UnauthorizedError = ({ message = 'UnauthorizedError', status = 401, extra = undefined } = {}) => {
    throw new Error(message, { cause: { status, extra } })
}

export const forbiddenRequestError = ({ message = 'forbiddenRequestError', status = 403, extra = undefined } = {}) => {
    throw new Error(message, { cause: { status, extra } })
}
