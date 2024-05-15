import {
  FastifyRequest,
  FastifyReply,
  FastifyError,
  RouteGenericInterface,
} from "fastify";
import { PaymentMethod, Transaction } from "../entities/entityTransaction";

interface transactionRequest extends RouteGenericInterface {
  body: Transaction;
}

export function verifyTransaction(
  request: FastifyRequest<transactionRequest>,
  reply: FastifyReply,
  done: (err?: FastifyError) => void
) {
  let { amount, description, method, name, cpf, card_number, valid, cvv } =
    request.body as Transaction;

  if (typeof cpf !== "number") {
    return reply.status(422).send({ error: "o CPF deve ser um número" });
  }

  if (card_number) {
    card_number = card_number.toString().slice(-4);
  } else {
    return reply
      .status(422)
      .send({ error: "o numero de cartão deve ser uma string ou um número" });
  }

  if (!Number.isInteger(amount)) {
    return reply
      .status(422)
      .send({ error: "O valor da transação deve ser um número inteiro" });
  }

  if (typeof description !== "string") {
    return reply
      .status(422)
      .send({ error: "a descriação deve ser uma string" });
  }

  if (method !== PaymentMethod.PIX && method !== PaymentMethod.CREDIT_CARD) {
    return reply
      .status(422)
      .send({ error: "o método deve ser 'pix' ou 'credit_card'" });
  }

  if (typeof name !== "string") {
    return reply.status(422).send({ error: "o nome deve ser uma string" });
  }
  if (method === PaymentMethod.CREDIT_CARD) {
    if (!card_number) {
      return reply.status(422).send({
        error: "Número do cartão é obrigatório para método de crédito.",
      });
    }
    if (typeof card_number !== "string" && typeof card_number !== "number") {
      return reply.status(422).send({
        error: "O número do cartão deve ser uma string ou número.",
      });
    }
    if (!Number.isInteger(valid) || !Number.isInteger(cvv)) {
      return reply.status(422).send({
        error: "Data de validade e CVV devem ser números inteiros.",
      });
    }
  }

  done();
}
