import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const mysql: SequelizeModuleOptions = {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'example',
  database: 'order',
  autoLoadModels: true,
  synchronize: true,
};
