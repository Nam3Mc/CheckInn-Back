import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
dotenvConfig({ path: '.env.development' });

const config = {
  type: 'postgres',
  database: "checkinn",
  // process.env.DB_NAME,
  host: "localhost",
  // process.env.DB_HOST,
  port: 5432,
  // process.env.DB_PORT as unknown as number,
  username: "postgres",
  // process.env.DB_USERNAME,
  // password: process.env.DB_PASSWORD,
  password: "2Years*end2022",
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  logging: false,
  synchronize: true,
  dropSchema: false,
};

export default registerAs('typeorm', () => config);

export const connectionSource = new DataSource(config as DataSourceOptions);
