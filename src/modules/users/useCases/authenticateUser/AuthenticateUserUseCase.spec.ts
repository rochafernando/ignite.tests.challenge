import "reflect-metadata";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });


  it("should be able to authenticate an user", async () => {
    const user = {
      name: "User Test",
      email: "test@test.com",
      password: "1234",
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });


    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("user");
    expect(result.user).toHaveProperty("id");
    expect(result.user).toHaveProperty("name");

  });

  it("should not be able to authenticate an nonexistent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "test@test.com",
        password: "1234"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate with incorrect password", async () => {
    expect(async () => {
      const user = {
        name: "User Test",
        email: "test@teste.com",
        password: "1234",
      };

      await createUserUseCase.execute(user);
      await authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrectPassword"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate with incorrect email", async () => {
    expect(async () => {
      const user = {
        name: "User Test",
        email: "test@test.com",
        password: "1234",
      };

      await createUserUseCase.execute(user);
      await authenticateUserUseCase.execute({
        email: "incorret@test.com",
        password: user.password
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
