import config from "../config";
import { UserPayload } from "../config/type";
import jwt from 'jsonwebtoken'
import logger from "../util/logger";
import { InvalidTokenException, TokenExepiredException } from "../util/Exception/http/Authenticationexception";
import { ServiceException } from "../util/Exception/ServiceExeption";
import { Response } from "express";
import ms from 'ms';

export class AuthenticatinService{
    constructor(private secretKey  = config.auth.secretKey,
        private refreshTokenExp = config.auth.refreshTokenExpiration,
        private tokenExpiration = config.auth.tokenExpiration,
    ){}

    generateToken(payload:UserPayload):string{
        return jwt.sign(
            payload,
            this.secretKey,
            {expiresIn:this.tokenExpiration}
        )
    }

     generateRefreshToken(payload:UserPayload):string{
            return jwt.sign(
                payload,
                this.secretKey,
                {expiresIn:this.refreshTokenExp}
            );
        }

          verirfyToken(token:string):UserPayload{
            try{
                return (jwt.verify(token,this.secretKey) )as UserPayload;
            }catch(error){
                logger.error("Token verification failed",error);
                if(error instanceof(jwt.TokenExpiredError)){
                    throw new TokenExepiredException();
                }
                if(error instanceof(jwt.JsonWebTokenError)){
                    throw new InvalidTokenException();
                }
                throw new ServiceException("toke verification failed ");
            }
        }

        setTokenIntocookie(res:Response,token:string){
            res.cookie('token',token,{
                httpOnly:true,
                secure:config.isProduction,
                maxAge:ms(this.tokenExpiration)
            })
        }

        setRefreshTokenIntoCookie(res:Response,refreshToken:string){
            res.cookie('refreshToken',refreshToken,{
                httpOnly:true,
                secure:config.isProduction,
                maxAge:ms(this.refreshTokenExp)
            })
        }
        clearTokens(res:Response){
            res.clearCookie('token');
            res.clearCookie('refreshToken');
        }
        persistAuthentication(res:Response,payload:UserPayload){
             const token=this.generateToken(payload)
            const refreshToken = this.generateRefreshToken(payload);
            this.setTokenIntocookie(res,token)
            this.setRefreshTokenIntoCookie(res,refreshToken);
        }
        refreshToken(refreshToken: string) {
            const payload = this.verirfyToken(refreshToken);

            const newPayload: UserPayload = {
                userId: payload.userId,
                role: payload.role
            };
            
            return this.generateToken(newPayload);
        }
}