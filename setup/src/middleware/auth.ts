import { NextFunction, Request, Response } from "express";
import { AuthenticatinService } from "../services/Auth.service";
import { AuthenticationFailed } from "../util/Exception/http/Authenticationexception";
import { AuthReq } from "../config/type";




const authService = new AuthenticatinService();


export function authenticate(req:Request,res:Response,next:NextFunction){
    let token =req.cookies.token;
    const refreshToken= req.cookies.refreshToken;

    if(!token){
        if(!refreshToken){
            throw new AuthenticationFailed();
        }
            const newToken=authService.refreshToken(refreshToken);
            authService.setTokenIntocookie(res,newToken);
        
       
            token=newToken;
    }
    const payload = authService.verirfyToken(token);
    (req as unknown as AuthReq).user = payload;
    next(); 
}