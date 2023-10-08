import "reflect-metadata";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";

import { OperationType } from "../../entities/Statement";

import { CreateStatementError } from "./CreateStatementError";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Create Statement", () => {

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to create a new Deposit statement", async () => {

    const user = {
      name: "User Test",
      email: "test@test.com",
      password: "1234",
    };

    const userCreated = await createUserUseCase.execute(user);

    const statement = {
      user_id: userCreated.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Deposit Test",
    };

    const statementCreated = await createStatementUseCase.execute(statement);

    expect(statementCreated).toHaveProperty("id");
    expect(statementCreated).toHaveProperty("user_id");
    expect(statementCreated).toHaveProperty("type");
    expect(statementCreated).toHaveProperty("amount");
    expect(statementCreated).toHaveProperty("description");
  });

  it("should be able to create a new Withdraw statement", async () => {

    const user = {
      name: "User Test",
      email: "test@test.com",
      password: "1234",
    };

    const userCreated = await createUserUseCase.execute(user);

    const statement = {
      user_id: userCreated.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Deposit Test",
    };

    await createStatementUseCase.execute(statement);

    const statementWithdraw = {
      user_id: userCreated.id as string,
      type: OperationType.WITHDRAW,
      amount: 100,
      description: "Withdraw Test",
    };

    const statementWithdrawCreated = await createStatementUseCase.execute(statementWithdraw);

    expect(statementWithdrawCreated).toHaveProperty("id");
    expect(statementWithdrawCreated).toHaveProperty("user_id");
    expect(statementWithdrawCreated).toHaveProperty("type");
    expect(statementWithdrawCreated).toHaveProperty("amount");
    expect(statementWithdrawCreated).toHaveProperty("description");
  });

  it("should not be able to create a new statement with insufficient funds", async () => {
    const user = {
      name: "User Test",
      email: "test@test.com",
      password: "1234",
    };

    const userCreated = await createUserUseCase.execute(user);

    const statement = {
      user_id: userCreated.id as string,
      type: OperationType.WITHDRAW,
      amount: 100,
      description: "Withdraw Test",
    };

    expect(async () => {
      await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);

  });

  it("should not be able to create a new statement with user not found", async () => {

    expect(async () => {
      const statement = {
        user_id: "user_not_found",
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Deposit Test",
      };

      await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

});
