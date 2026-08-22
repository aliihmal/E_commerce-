import { NextFunction, Request, Response } from "express"
import logger from "../util/logger";
export const requestLogger  =(req:Request,res:Response,next:NextFunction)=>{
    const startTime  = Date.now();
    req.on("finish",()=>{
        const endTime = Date.now() - startTime;
        const status  = res.statusCode;
            let level= status>=500?'error':status>=400?'warn':'info';
        const {method,originalUrl} = req;
        logger.log({level,message: `${status} method :${method} base url : ${originalUrl} respond time : ${endTime}`})
    })
    next();
}   