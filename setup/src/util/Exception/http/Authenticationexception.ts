import logger from "../../logger";
import { httpExecption } from "../httpException";

export class AuthenticationException extends httpExecption{
    constructor(message:string){
        super(401,message);
        this.name="AuthenticationException";
        logger.error("the error is " + message);
    }
}


export class  TokenExepiredException  extends AuthenticationException{
    constructor(){
        super("token Expired");
        this.name="TokenExepiredException";
    }
}

export class InvalidTokenException extends AuthenticationException{
    constructor(){
        super("Invalid Token");
        this.name="InvalidTokenException";
    }
}

export class AuthenticationFailed extends AuthenticationException{
    constructor(){
        super("Authentication Failed");
        this.name="AuthenticationFailedException";
    }
}