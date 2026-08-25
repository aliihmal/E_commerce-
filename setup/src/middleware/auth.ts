import { NextFunction, Request, Response } from "express";
import { AuthenticatinService } from "../services/Auth.service";
import { AuthenticationFailed, TokenExepiredException } from "../util/Exception/http/Authenticationexception";
import { AuthReq } from "../config/type";




const authService = new AuthenticatinService();


export function authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    const refreshToken = req.cookies.refreshToken;

    try {
        if (!token) throw new TokenExepiredException(); // no token = treat like expired, go refresh
        const payload = authService.verirfyToken(token);
        (req as unknown as AuthReq).user = payload;
        return next();
    } catch (err) {
        if (!(err instanceof TokenExepiredException) || !refreshToken) {
            throw new AuthenticationFailed();
        }
        const newToken = authService.refreshToken(refreshToken); // will throw if refresh token is bad/expired too
        authService.setTokenIntocookie(res, newToken);
        const payload = authService.verirfyToken(newToken);
        (req as unknown as AuthReq).user = payload;
        return next();
    }
}