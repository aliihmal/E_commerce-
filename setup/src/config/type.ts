import { JwtPayload } from "jsonwebtoken";
import { ROLE } from "./role";

export interface  UserPayload{
        userId:string;
        role:ROLE;
}

export interface TokenPayload extends JwtPayload{
        user:UserPayload;
}
export interface AuthReq extends Request{
        user:UserPayload;
}