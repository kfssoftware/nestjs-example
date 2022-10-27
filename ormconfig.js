// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

module.exports = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  schema: process.env.POSTGRES_SCHEMA,
  database: process.env.POSTGRES_DATABASE,
  autoLoadEntities: true,
  synchronize: true,
  migrations: ['src/migration/*.js'],
  cli: {
    migrationsDir: 'src/migration',
  },
};
