import { NextFunction, Request, Response } from "express";
import { Permission, rolePermission } from "../config/role";
import { AuthReq } from "../config/type";
import { AuthenticationFailed } from "../util/Exception/http/Authenticationexception";
import logger from "../util/logger";
import { InsufficientPermissionException, InvalidRoleException } from "../util/Exception/http/AuthorizationException";

export function hasPermission(permission:Permission){
    return(req:Request,res:Response,next:NextFunction)=>{
        const autherequest = (req as unknown as AuthReq);
        if(!autherequest.user){
            throw new AuthenticationFailed();
        }        
        const userRole = autherequest.user.role;

        if(!rolePermission[userRole]){
            logger.error(`Invalid role: ${userRole}`);
            throw new   InvalidRoleException(userRole);
        }
        if(!rolePermission[userRole].includes(permission)){
            logger.error(`user with role ${userRole} does not have permission ${permission}`)
            throw new InsufficientPermissionException();
        }
        next();
    }
}