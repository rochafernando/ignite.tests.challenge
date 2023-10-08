import "reflect-metadata";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";

import { OperationType } from "../../entities/Statement";

import { GetBalanceError } from "./GetBalanceError";
import { User } from "@modules/users/entities/User";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let userCreated: User;

describe("Get Balance Statement", () => {

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);

    const user = {
      name: "User Test",
      email: "test@test.com",
      password: "1234",
    };

    userCreated = await createUserUseCase.execute(user);

    const statement = {
      user_id: userCreated.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Deposit Test",
    };

    await createStatementUseCase.execute(statement);

  });

  afterAll(async () => {
    //jest.setTimeout(10000);
  });

  it("should be able to get balance without statements", async () => {


    const balance = await statementsRepository.getUserBalance({
      user_id: userCreated.id as string,
      with_statement: false,
    });

    expect(balance).toHaveProperty("balance");
    expect(balance).not.toHaveProperty("statement");



  });

  it("should be able to get balance with statements", async () => {


    const balance = await statementsRepository.getUserBalance({
      user_id: userCreated.id as string,
      with_statement: true,
    });
    expect(balance).toHaveProperty("balance");
    expect(balance).toHaveProperty("statement");
  });

  it("should not be able to get balance with non-existing user", () => {
    expect(async () => {
      const request = {
        user_id: "non-existing-user",
        with_statement: true,
      };
      await statementsRepository.getUserBalance(request);
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
