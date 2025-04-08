import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/clean-architecture-todo'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default_jwt_secret_key_for_development',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  }
};
