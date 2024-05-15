import { FastifyInstance } from "fastify";
import { createPayable, getBalance } from "../controllers/controllerPayable";

export function payableRouters(fastify: FastifyInstance) {
  fastify.route({
    method: "POST",
    url: "/payable",
    handler: createPayable,
  });

  fastify.route({
    method: "GET",
    url: "/balance",
    handler: getBalance,
  });
}
