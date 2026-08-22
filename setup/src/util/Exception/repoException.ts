export class InitializabelException extends Error{
    constructor(message:string , e:Error){
        super(message);
        this.name="InitializableException";
        this.stack =e.stack;
        this.message=`${message} : %{e.message}`;
    }
}

export class DBexception extends Error{
    constructor(message:string,e:Error){
        super(message);
        this.name = "DB Exception"
        this.stack  = e.stack;
        this.message= `${message} : %{e.message}`;
    }
}