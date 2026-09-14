import 'dotenv/config';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  String(process.env.POSTGRES_PASSWORD ?? ''),
  {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT) || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? (msg) => console.log(`[Sequelize] ${msg}`) : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions:
      process.env.POSTGRES_SSL === 'true'
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      `PostgreSQL Database connected successfully: ${process.env.POSTGRES_DB} on ${process.env.POSTGRES_HOST}`
    );
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

export { sequelize };
export default sequelize;
