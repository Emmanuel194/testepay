import request from "supertest";
import fastify, { FastifyInstance } from "fastify";
import { startDataBase } from "../../../../database/db";
import { transactionRouters } from "../../routers/routerPayable";

describe("Testes para a rota /transaction", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = fastify();
    transactionRouters(app);

    await startDataBase();
  });

  afterAll(() => {
    app.close();
  });

  it("deve criar uma nova transação com sucesso", async () => {
    const transactionData = {
      amount: 100,
      description: "Compra online",
      method: "credit_card",
      name: "John Doe",
      cpf: "12345678901",
      card_number: "1234567890123456",
      valid: "12/25",
      cvv: "123",
    };

    const response = await request(app)
      .post("/transaction")
      .send(transactionData);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("sucesso");
    expect(response.body.transaction).toBeDefined();
  });

  it("deve retornar erro ao processar transação inválida", async () => {
    const invalidTransactionData = {};

    const response = await request(app)
      .post("/transaction")
      .send(invalidTransactionData);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("erro ao processar transação");
  });
});
