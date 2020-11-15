import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "kas123",
  database: "taskmgr",
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  synchronize: true,
};
