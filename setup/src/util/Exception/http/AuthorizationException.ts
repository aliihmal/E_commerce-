import { httpExecption } from "../httpException";

export class AuthorizationException extends httpExecption{
    constructor(message:string){
        super(401,message);
        this.name="AuthorizationFailed";
    }
}


export class InvalidRoleException extends AuthorizationException{
    constructor(role:string){
        super("Invalid Role " + role);
        this.name = "InvalidRoleException";
    }
}

export class InsufficientPermissionException extends AuthorizationException{
    constructor(){
        super("Insufficient Exception");
        this.name = "InsufficientPermissionException";
    }
}