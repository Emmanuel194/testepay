import { FastifyRequest, FastifyReply } from "fastify";
import { getRepository, getConnection } from "typeorm";
import { Payable, payableStatus } from "../entitiy/entityPayable";
import { Transaction } from "../../transactions/entities/entityTransaction";

export async function createPayable(
  request: FastifyRequest<{ Body: { transaction: Transaction } }>,
  reply: FastifyReply
) {
  const { transaction } = request.body;
  const { amount, method } = transaction;
  const fee = method === "pix" ? 0.0299 : 0.0899;
  const status = method === "pix" ? "paid" : "waiting_funds";
  const payment_date =
    method === "pix"
      ? new Date()
      : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

  const payableAmount = amount * (1 - fee);

  try {
    const payableRepository = getConnection().getTreeRepository(Payable);
    const newPayable = payableRepository.create({
      transaction: transaction,
      status: status as payableStatus,
      payment_date,
      fee,
      amount: payableAmount,
    });

    const result = await payableRepository.save(newPayable);
    return reply.status(200).send({ status: "sucesso", payable: result });
  } catch (error) {
    console.log(error);
    return reply.status(500).send({ error: "erro ao processar o payable" });
  }
}

export async function getBalance(
  request: FastifyRequest<{ Params: { cpf: number } }>,
  reply: FastifyReply
) {
  const { cpf } = request.params;
  try {
    const payableRepository = getRepository(Payable);
    const payables = await payableRepository
      .createQueryBuilder("payable")
      .innerJoin("payable.transaction", "transaction")
      .where("transaction.cpf = :cpf", { cpf })
      .getMany();

    // saldo a receber
    let available = 0;
    let waitingFunds = 0;

    for (const payable of payables) {
      if (payable.status === "paid") {
        available += payable.amount;
      } else if (payable.status === "waiting_funds") {
        waitingFunds += payable.amount;
      }
    }
    return reply.send({
      status: "sucesso",
      balance: { available, waitingFunds },
    });
  } catch (error) {
    return reply.status(500).send({ error: "erro ao busca saldo" });
  }
}
