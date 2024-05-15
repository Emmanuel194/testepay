import { FastifyInstance } from "fastify";
import {
  getAllTransactions,
  getTransactionByCpf,
  handleTransaction,
} from "../controllers/transactionController";
import { verifyTransaction } from "../middleware/verificationTransaction";

export function transactionRouters(fastify: FastifyInstance) {
  fastify.route({
    method: "POST",
    url: "/transaction",
    preHandler: verifyTransaction,
    handler: handleTransaction,
  });

  fastify.route({
    method: "GET",
    url: "/transactions",
    handler: getAllTransactions,
  });

  fastify.route({
    method: "get",
    url: "/transaction",
    handler: getTransactionByCpf,
  });
}
