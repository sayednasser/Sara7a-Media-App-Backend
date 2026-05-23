export const successRequest=({res,status=200,message='Done',data=undefined}={})=>{
    return res.status(status).json({status,message,data})

}