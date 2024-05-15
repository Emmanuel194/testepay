import { FastifyRequest, FastifyReply } from "fastify";
import { getRepository, getConnection } from "typeorm";
import { Transaction } from "../entities/entityTransaction";
import { startDataBase } from "../../../database/db";

export async function handleTransaction(
  request: FastifyRequest<{ Body: Transaction }>,
  reply: FastifyReply
) {
  let { amount, description, method, name, cpf, card_number, valid, cvv } =
    request.body;

  if (card_number) {
    card_number = card_number.toString().slice(-4);
  }

  try {
    await startDataBase();
    const transactionRepository = getConnection().getRepository(Transaction);
    const newTransaction = transactionRepository.create({
      amount,
      description,
      method,
      name,
      cpf,
      card_number,
      valid,
      cvv,
    });

    let result;
    if (newTransaction) {
      result = await transactionRepository.save(newTransaction);
    } else {
      console.error("a nova transação é indefinido");
    }
    if (result) {
      return reply.status(200).send({ status: "sucesso", transaction: result });
    } else {
      return reply.status(500).send({ error: "erro ao processar transação" });
    }
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "Aconteceu um erro na transação" });
  }
}

// function generateUniqueId(): string {
//   return uuidv4();
// }

//  Function para listar transações.

export async function getAllTransactions(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const transactionRepository = getRepository(Transaction);
    const transactions = await transactionRepository.find();
    return reply.send({ status: "sucesso", transactions });
  } catch (error) {
    return reply.status(500).send({ error: "Erro ao buscar transações" });
  }
}

// Filtrar transações por cpf

export async function getTransactionByCpf(
  request: FastifyRequest<{ Querystring: { cpf: number } }>,
  reply: FastifyReply
) {
  const { cpf } = request.query;

  try {
    const transactionRepository = getRepository(Transaction);
    const transactions = await transactionRepository.find({ where: { cpf } });
    return reply.send({ status: "Busca realizada com sucesso", transactions });
  } catch (error) {
    return reply.status(500).send({ error: "error ao buscar transações" });
  }
}
