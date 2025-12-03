export const asynchandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
        error.cause = error.cause || 500; // Ensure error has a cause
        return next(error);
    });
};

export const globalhandlingerror=(error,req,res,next)=>{
if(process.env.MOOD="DEV"){
    return res.status(error.cause||400).json({message:error.message,error,stack:error.stack})
}
return res.status(error.cause||400).json({message:error.message,error})
}