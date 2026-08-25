import helmet from "helmet";
import config from "./config";
import logger from "./util/logger";
import cors from "cors";
import bodyParser, { urlencoded } from 'body-parser';
import express, { NextFunction, Request, Response } from "express";
import { requestLogger } from "./middleware/requestLogger";

import router from "./routes";
import { httpExecption } from "./util/Exception/httpException";
import cookieParser from "cookie-parser";
const app = express() ;


app.use(cors({
    origin: "https://e-commerce-1-25t8.onrender.com",
    credentials: true,
}));

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(requestLogger);
//cookie parser
app.use(cookieParser())
app.use('/',router);

app.use((req,res)=>{
    res.status(404).json({error:"NOt Found "});
})

app.use((err:Error,req:Request,res:Response,next:NextFunction)=>{
    if(err instanceof httpExecption){   
        const httpexception = err as httpExecption;
        logger.error("%s [%d] : \ %s \%s %o",httpexception.name,httpexception.status,httpexception.message,httpexception.details||{});
        res.status(httpexception.status).json({
            message :httpexception.message,
            details:httpexception.details||undefined,
        })
    }else{
        logger.error("internal server Error %s", err.message);
        res.status(500).json({message:"couldn't handel the request"})
    }
})
app.listen(config.port,config.host,()=>{
    logger.info("the app is running on http://%s:%d",config.host,config.port);
    
})