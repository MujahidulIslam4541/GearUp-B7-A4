import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") })

export default {
    port: process.env.PORT!,
    app_url:process.env.APP_URL!,
    database_url: process.env.DATABASE_URL!,
    jwt_access_token_secret:process.env.JWT_ACCESS_TOKEN_SECRET!,
    jwt_refresh_token_secret:process.env.JWT_REFRESH_TOKEN_SECRET!,
    jwt_access_token_expiredIn:process.env.JWT_ACCESS_TOKEN_EXPIRATION!,
    jwt_refresh_token_expiredIn:process.env.JWT_REFRESH_TOKEN_EXPIRATION!,
    bcrypt_salt_rounds:process.env.BCRYPT_SALT_ROUNDS!

}