import { httpExecption } from "../httpException";

export class NotFoundException extends httpExecption{
    constructor(message: string="Resource not found",details?:Record<string,unknown>){
        super(404,message,details);
        this.name="NotFoundException";
    }
}