import dotenv from "dotenv"
import path from "path"

import type { StringValue } from 'ms';

dotenv.config({path:path.join(__dirname,'../../.env')})
export default{
    logDir:process.env.LOG_DIR || "./logs",
    isDev:process.env.NODE_ENV=="development",
     port:process.env.PORT?parseInt(process.env.PORT): 3000,
     isProduction:process.env.NODE_ENV == "production",
     host: process.env.HOST || 'localhost',
     storagePath:{
        
        sqlite:'src/Data/database.db',
        postegress:process.env.DATABASE_URL,
    },
    auth:{
          secretKey:process.env.JWT_SECRET_KEY || "secret_1234567890",
          tokenExpiration:(process.env.TOKEN_EXPIRATION || "15m") as StringValue,
          refreshTokenExpiration:(process.env.REFRESH_TOKEN_EXPIRATION || "7d") as StringValue
     },
      imagekitConfig : {
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    }
}