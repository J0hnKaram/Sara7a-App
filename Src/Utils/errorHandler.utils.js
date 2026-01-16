export const globalErrorHandler = (err,req,res,next)=>{
        const status = err.cause || 500
        return res.status(status).json({message:"something went wrong",
            error: err.message , 
            stack: err.stack
        })
    }