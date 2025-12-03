export const successResponse=({res,status=200,data={},message="DONE"}={})=>{
    return res.status(status).json({message,data})
}