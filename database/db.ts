import * as dotenv from "dotenv";
import { createConnection, DataSource } from "typeorm";
dotenv.config();

import { Transaction } from "../modules/transactions/entities/entityTransaction";
import { Payable } from "../modules/Payable/entitiy/entityPayable";

let connection: DataSource;

export async function startDataBase() {
  if (!connection) {
    try {
      connection = await createConnection({
        type: "postgres",
        host: process.env.DB_HOST,
        port: 5432,
        database: process.env.DB_DATABASE,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        entities: [Transaction, Payable],
        synchronize: true,
      });
      console.log(`Banco de dados inicializado`);
    } catch (error) {
      console.log(error, "error ao inicializar o banco de addos");
      process.exit(1);
    }
  }
  return connection;
}
