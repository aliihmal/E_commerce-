export class httpExecption extends Error{
    constructor(
        public readonly status:number,
        public readonly message:string,
        public readonly details?:Record<string,unknown>,
    ){
        super(message);
        this.name="httpExecption";
    }
}

export class BadRequestException extends httpExecption{
    constructor(message:string="Bad Request",details?:Record<string,unknown>){
        super(404,message,details);
        this.name="BadRequestException"
    }
}
