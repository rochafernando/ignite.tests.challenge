import "reflect-metadata";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = {
      name: "User Test",
      email: "test@test.com",
      password: "1234",
    };

    await createUserUseCase.execute(user);

    const userCreated = await usersRepository.findByEmail(user.email);

    expect(userCreated).toHaveProperty("id");

    expect(userCreated).toMatchObject({
      name: user.name,
      email: user.email,
    });

  });

  it("should not be able to create a new user with email exists", async () => {

    expect(async () => {
      const user = {
        name: "User Test",
        email: "test@test.com",
        password: "1234",
      };

      await createUserUseCase.execute(user);
      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(CreateUserError);

  });
});
