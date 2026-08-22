import { Request, Response } from "express";
import { AuthenticatinService } from "../services/Auth.service";
import { userServic } from "../services/user.service";
import { BadRequestException } from "../util/Exception/httpException";
import { UserPayload } from "../config/type";

export class AuthController{
     constructor(private autheService :AuthenticatinService,private userservice:userServic){}

    async login(req:Request,res:Response){
        const {email,password} = req.body;
        if(!email || ! password){
            throw new BadRequestException("Email and password are require" ,{
                "email":!email,
                "password":!password,
            })
        }
        const user = await this.userservice.validateUser(email,password);
        const userPayload:UserPayload={userId:user.id,role:user.role};
        this.autheService.persistAuthentication(res,userPayload);
        
        res.status(200).json({
            message:'login successfuly',
             user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
    }
        })
    }
    signUp(){

    }
    async logout(req:Request,res:Response):Promise<void>{
        this.autheService.clearTokens(res);
        res.status(200).json({message:"Logout successfully "})
    }
}