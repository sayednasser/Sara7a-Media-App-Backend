import fs from 'node:fs'
export const GlobalErrorHandler = (error, req, res, next) => {
    const status = error.cause?.status ?? 500
    if(req.file){
        if(fs.existsSync(req.file.path)){
            fs.unlinkSync(req.file.path)
        }
    }
    if(req.files){
        req.files.forEach(file=>{
            if(fs.existsSync(file.path)){
                fs.unlinkSync(file.path)
            }
        })
    }
    const defaultMessage = 'SomeThing went wrong'
    const displayMessage = error.message || defaultMessage
    return res.status(status).json({
        status,
        error_message: status == 500 ?? defaultMessage ? displayMessage : displayMessage,
        stack: error.stack,
        extra: error.cause?.extra
    })

}
