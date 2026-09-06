import { NextFunction, Request, Response } from "express";
import { AuthenticatinService } from "../services/Auth.service";
import { AuthenticationFailed, TokenExepiredException } from "../util/Exception/http/Authenticationexception";
import { AuthReq } from "../config/type";




const authService = new AuthenticatinService();


export function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log("=================================");
    console.log("AUTHENTICATION CHECK");
    console.log("=================================");

    console.log("Cookies:", req.cookies);
    console.log("Token:", req.cookies?.token);
    console.log("Refresh token:", req.cookies?.refreshToken);

    const token = req.cookies?.token;
    const refreshToken = req.cookies?.refreshToken;

    try {
        if (!token) {
            console.log("NO ACCESS TOKEN");
            throw new TokenExepiredException();
        }

        const payload = authService.verirfyToken(token);

        console.log("ACCESS TOKEN VALID");
        console.log("USER:", payload);

        (req as unknown as AuthReq).user = payload;

        return next();

    } catch (err) {

        console.log("ACCESS TOKEN FAILED");

        if (
            !(err instanceof TokenExepiredException) ||
            !refreshToken
        ) {
            console.log("NO VALID REFRESH TOKEN");

            throw new AuthenticationFailed();
        }

        console.log("REFRESH TOKEN FOUND");

        const newToken =
            authService.refreshToken(refreshToken);

        authService.setTokenIntocookie(
            res,
            newToken
        );

        const payload =
            authService.verirfyToken(newToken);

        (req as unknown as AuthReq).user = payload;

        console.log("TOKEN REFRESHED SUCCESSFULLY");

        return next();
    }
}