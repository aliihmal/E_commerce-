import { Request, Response } from "express";
import { BadRequestException } from "../util/Exception/httpException";
import { userBuilder } from "../model/builder/user.builder";
import { generateUUID } from "../util";
import { ROLE } from "../config/role";
import { userServic } from "../services/user.service";
import { threadCpuUsage } from "process";

export class userController {
    
    constructor(private userService:userServic){}


        async create(req:Request,res:Response):Promise<void>{
            const {name,email,password,phone}=req.body;
            if(!name || !email || !password || !phone){
                throw new BadRequestException("All the element must be provided before creating a user",{
                    name:!name,
                    email:!email,
                    password:!password,
                    phone:!phone
                })
            }

            //validate the email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                        res.status(400).json({ message: 'Invalid email format' });
                        return ;    
                    }


            const userItem = userBuilder.newUserBuilder().setId(generateUUID("user"))
            .setName(name).setEmail(email).setPassowrd(password).setRole(ROLE.user).setPhone(phone).build();
            
            const id = await this.userService.createuser(userItem);
            res.status(200).json({"message":"the user was created succssfully",
                                "id":id
            })
        }
        async updateUser(req:Request,res:Response):Promise<void>{
            const {name,email,password,role} = req.body;
            if(!name || !email || !password || !role){
                throw new BadRequestException("All the element must be provided before creating a user",{
                    name:!name,
                    email:!email,
                    password:!password,
                    phone:!role
                })
            }
            const theCurrentUser  = await this.userService.validateUser(email,password);

            theCurrentUser.role = role;
            await this.userService.updateuser(theCurrentUser);
            res.status(200).json({"message" : "The user was updated succsseffuly"})

        }

        async getUserById(req:Request,res:Response):Promise<void>{
            const id = req.params.id as string;

            const theuser = await this.userService.getUserById(id);
            res.status(200).json({"message":"the user was retrived succssfully",
                "user":theuser
            })
        }
}