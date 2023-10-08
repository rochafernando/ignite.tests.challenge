import "reflect-metadata";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

import { OperationType } from "../../entities/Statement";
import { GetStatementOperationError } from "./GetStatementOperationError";



let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(async () => {

    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository);
  });

  it("should be able to get statement operation", async () => {
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

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: userCreated.id as string,
      statement_id: statementCreated.id as string,
    });

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation).toHaveProperty("user_id");
    expect(statementOperation).toHaveProperty("type");
    expect(statementOperation).toHaveProperty("amount");
    expect(statementOperation).toHaveProperty("description");

  });
  it("should not be able to get statement operation if user not exists", async () => {
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

    await expect(getStatementOperationUseCase.execute({
      user_id: "user_id",
      statement_id: statementCreated.id as string,
    })).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);


  });

  it("should not be able to get statement operation if statement not exists", async () => {
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

    await expect(getStatementOperationUseCase.execute({
      user_id: userCreated.id as string,
      statement_id: "statement_id",
    })).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);

  });

});
