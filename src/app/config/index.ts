import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
const envPath = path.join(process.cwd(), '/.env');
dotenv.config({ path: envPath });

// Export the configuration object
export default {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  dbName: process.env.DB_NAME,
  nodeEnv: process.env.NODE_ENV,
  bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,
};
