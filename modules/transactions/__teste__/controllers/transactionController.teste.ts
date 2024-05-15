// Importações necessárias
import { handleTransaction } from "../../controllers/transactionController";
import { FastifyRequest, FastifyReply } from "fastify";
import { getConnection, Transaction } from "typeorm";

interface ReplyMock {
  status: jest.Mock<ReplyMock, [number]>;
  send: jest.Mock<ReplyMock, [any]>;
}

jest.mock("typeorm", () => ({
  getConnection: jest.fn().mockReturnValue({
    getRepository: jest.fn().mockReturnValue({
      create: jest.fn().mockImplementation((transaction) => transaction),
      save: jest.fn().mockResolvedValue(true),
    }),
  }),
}));

jest.mock("../../../database/db", () => ({
  startDataBase: jest.fn().mockResolvedValue(true),
}));

const createReplyMock = (): ReplyMock => {
  const reply: ReplyMock = {
    status: jest.fn<ReplyMock, [number]>(() => reply),
    send: jest.fn<ReplyMock, [any]>(() => reply),
  };
  return reply;
};

describe("Testes da API de Transação", () => {
  it("deve processar uma transação com sucesso", async () => {
    const requestMock = {
      body: {
        amount: 100,
        description: "Descrição da transação",
        method: "crédito",
        name: "Nome do Cliente",
        cpf: "000.000.000-00",
        card_number: "1234567890123456",
        valid: "12/34",
        cvv: "123",
      },
    } as unknown as FastifyRequest<{ Body: Transaction }>;
    const replyMock = createReplyMock();

    // Executando a função handleTransaction
    // await handleTransaction(requestMock, replyMock);

    // Verificações
    expect(replyMock.status).toHaveBeenCalledWith(200);
    expect(replyMock.send).toHaveBeenCalledWith({
      status: "sucesso",
      transaction: expect.any(Object),
    });
  });
});
