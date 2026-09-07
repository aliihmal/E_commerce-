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

    // ============================================================
    // Generate access token
    // ============================================================

    generateToken(payload: UserPayload): string {
        return jwt.sign(
            payload,
            this.secretKey,
            {
                expiresIn: this.tokenExpiration
            }
        );
    }

    // ============================================================
    // Generate refresh token
    // ============================================================

    generateRefreshToken(payload: UserPayload): string {
        return jwt.sign(
            payload,
            this.secretKey,
            {
                expiresIn: this.refreshTokenExp
            }
        );
    }

    // ============================================================
    // Verify token
    // ============================================================

    verirfyToken(token: string): UserPayload {
        try {

            return jwt.verify(
                token,
                this.secretKey
            ) as UserPayload;

        } catch (error) {

            logger.error(
                "Token verification failed",
                error
            );

            if (error instanceof jwt.TokenExpiredError) {
                throw new TokenExepiredException();
            }

            if (error instanceof jwt.JsonWebTokenError) {
                throw new InvalidTokenException();
            }

            throw new ServiceException(
                "Token verification failed"
            );
        }
    }

    // ============================================================
    // Cookie options
    // ============================================================

    private getCookieOptions(maxAge: number) {
    return {
        httpOnly: true,

        // Render uses HTTPS
        secure: true,

        // Frontend and backend are on different domains
        sameSite: "none" as const,

        maxAge,

        path: "/",
    };
}

    // ============================================================
    // Set access token cookie
    // ============================================================

    setTokenIntocookie(
        res: Response,
        token: string
    ): void {

        res.cookie(
            "token",
            token,
            this.getCookieOptions(
                ms(this.tokenExpiration)
            )
        );

        logger.info(
            "Access token cookie created"
        );
    }

    // ============================================================
    // Set refresh token cookie
    // ============================================================

    setRefreshTokenIntoCookie(
        res: Response,
        refreshToken: string
    ): void {

        res.cookie(
            "refreshToken",
            refreshToken,
            this.getCookieOptions(
                ms(this.refreshTokenExp)
            )
        );

        logger.info(
            "Refresh token cookie created"
        );
    }

    // ============================================================
    // Clear authentication cookies
    // ============================================================

    clearTokens(
        res: Response
    ): void {

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none" as const,
            path: "/",
        };

        res.clearCookie(
            "token",
            options
        );

        res.clearCookie(
            "refreshToken",
            options
        );

        logger.info(
            "Authentication cookies cleared"
        );
    }

    // ============================================================
    // Persist authentication after login
    // ============================================================

    persistAuthentication(
        res: Response,
        payload: UserPayload
    ): void {

        const token =
            this.generateToken(payload);

        const refreshToken =
            this.generateRefreshToken(payload);

        this.setTokenIntocookie(
            res,
            token
        );

        this.setRefreshTokenIntoCookie(
            res,
            refreshToken
        );

        logger.info(
            "Authentication persisted successfully"
        );
    }

    // ============================================================
    // Refresh access token
    // ============================================================

    refreshToken(
        refreshToken: string
    ): string {

        const payload =
            this.verirfyToken(refreshToken);

        const newPayload: UserPayload = {
            userId: payload.userId,
            role: payload.role
        };

        return this.generateToken(
            newPayload
        );
    }
}
// ```

// After replacing it:

// **1. Save the file.**
// **2. Build your backend.**

// ```bash
// npm run build
// ```

// **3. Deploy/redeploy the backend to Render.**

// **4. On your phone, log out and log in again.** This is important because the old cookies may still be present.

// Then try adding the product again.

// Also fix this small typo in your `LoginPage`:

// ```ts
// sessionStorage.setItem("user", JSON.stringify(data.user));

// console.log(
//     "USER STORED:",
//     sessionStorage.getItem("user")
// );
// ```

// instead of checking `localStorage`.

// If the phone **still gets 401 after this**, send me your `config` file next. That will be the next thing to check.
