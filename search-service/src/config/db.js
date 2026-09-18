import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const dbName = process.env.POSTGRES_DB || process.env.DB_NAME || 'cartverse';
const dbUser = process.env.POSTGRES_USER || process.env.DB_USER || 'postgres';
const dbPassword = process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD || 'postgres';
const dbHost = process.env.POSTGRES_HOST || process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.POSTGRES_PORT || process.env.DB_PORT || '5432', 10);

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 10,
    min: 2,
    acquire: 10000,
    idle: 5000,
  },
});

export const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    return true;
  } catch (err) {
    console.error('[DB] PostgreSQL connection error:', err.message);
    return false;
  }
};
