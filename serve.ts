import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import * as path from "path";
import * as dotenv from "dotenv";
import { startDataBase } from "./database/db";
import fs from "fs";
import { transactionRouters } from "./modules/transactions/routers/transaction.router";
import { payableRouters } from "./modules/Payable/routers/routerPayable";

dotenv.config();

const server: FastifyInstance = fastify({ logger: true });

// documentação

server.get("/docs", async (request: FastifyRequest, reply: FastifyReply) => {
  const html = fs.readFileSync(
    path.join(__dirname, "documentation.html"),
    "utf-8"
  );
  reply.type("text/html").send(html);
});

// hooks

server.addHook("onRequest", async (request, reply) => {
  (request as any).pgClient = await startDataBase();
});

server.addHook("onResponse", async (request, reply) => {
  const connection = (request as any).pgClient;
  if (connection && typeof connection.close === "function") {
    await connection.close();
  }
});

transactionRouters(server);
payableRouters(server);

server.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
  reply.code(200).send({ message: "sucesso!" });
});

const port = 3000;
export const initServe = async () => {
  try {
    console.log("a conexão foi iniciada com sucesso");
    await server.listen({ port: 3000 }, () => {
      console.log(`Servidor iniciado: http://localhost:${port}`);
    });
  } catch (err) {
    console.error("erro ao conectar ao banco de dados", err);
    process.exit(1);
  }
};
