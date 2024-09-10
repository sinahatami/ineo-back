import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

const databaseConfig: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/config/migration/*{.ts,.js}'],
    synchronize: true,
};

export default registerAs('typeorm', () => databaseConfig);

export const AppDataSource = new DataSource(databaseConfig);
