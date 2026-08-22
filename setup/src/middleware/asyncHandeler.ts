import { NextFunction, Request, Response } from "express";

const asyncHandler = (fn : (req: Request, res: Response)=>Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => fn(req, res).catch(next);
};
export default asyncHandler;