import "reflect-metadata";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";

let usersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to show an user profile", async () => {
    const user = {
      name: "User Test",
      email: "test@test.com",
      password: "1234",
    };

    const userCreated = await createUserUseCase.execute(user);

    const result = await showUserProfileUseCase.execute(userCreated.id);

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("email");
  });

  it("should not be able to show an nonexistent user profile", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("1234");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });

});
