import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI.replace(
    '<db_password>',
    process.env.DB_PASSWORD
  ),
};