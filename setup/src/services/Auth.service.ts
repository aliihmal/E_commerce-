import config from "../config";
import { UserPayload } from "../config/type";
import jwt from "jsonwebtoken";
import logger from "../util/logger";
import {
    InvalidTokenException,
    TokenExepiredException
} from "../util/Exception/http/Authenticationexception";
import { ServiceException } from "../util/Exception/ServiceExeption";
import { Response } from "express";
import ms from "ms";

export class AuthenticatinService {

    constructor(
        private secretKey = config.auth.secretKey,
        private refreshTokenExp = config.auth.refreshTokenExpiration,
        private tokenExpiration = config.auth.tokenExpiration,
    ) {}

    generateToken(payload: UserPayload): string {
        return jwt.sign(
            payload,
            this.secretKey,
            {
                expiresIn: this.tokenExpiration
            }
        );
    }

    generateRefreshToken(payload: UserPayload): string {
        return jwt.sign(
            payload,
            this.secretKey,
            {
                expiresIn: this.refreshTokenExp
            }
        );
    }

    verirfyToken(token: string): UserPayload {
        try {
            return jwt.verify(
                token,
                this.secretKey
            ) as UserPayload;

        } catch (error) {

            logger.error("Token verification failed", error);

            if (error instanceof jwt.TokenExpiredError) {
                throw new TokenExepiredException();
            }

            if (error instanceof jwt.JsonWebTokenError) {
                throw new InvalidTokenException();
            }

            throw new ServiceException("token verification failed");
        }
    }

    setTokenIntocookie(res: Response, token: string): void {
        res.cookie("token", token, {
            httpOnly: true,
            secure: config.isProduction,
            sameSite: config.isProduction ? "none" : "lax",
            maxAge: ms(this.tokenExpiration),
            path: "/",
        });
    }

    setRefreshTokenIntoCookie(
        res: Response,
        refreshToken: string
    ): void {
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: config.isProduction,
            sameSite: config.isProduction ? "none" : "lax",
            maxAge: ms(this.refreshTokenExp),
            path: "/",
        });
    }

    clearTokens(res: Response): void {

        res.clearCookie("token", {
            httpOnly: true,
            secure: config.isProduction,
            sameSite: config.isProduction ? "none" : "lax",
            path: "/",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: config.isProduction,
            sameSite: config.isProduction ? "none" : "lax",
            path: "/",
        });
    }

    persistAuthentication(
        res: Response,
        payload: UserPayload
    ): void {

        const token = this.generateToken(payload);
        const refreshToken = this.generateRefreshToken(payload);

        this.setTokenIntocookie(res, token);
        this.setRefreshTokenIntoCookie(res, refreshToken);
    }

    refreshToken(refreshToken: string): string {

        const payload = this.verirfyToken(refreshToken);

        const newPayload: UserPayload = {
            userId: payload.userId,
            role: payload.role
        };

        return this.generateToken(newPayload);
    }
}
