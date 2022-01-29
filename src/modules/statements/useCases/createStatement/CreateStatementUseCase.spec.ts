import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

describe("Unity test CreateStatementUseCase", () => {
  const usersRepository = new InMemoryUsersRepository();
  const statementRepository = new InMemoryStatementsRepository();
  const createStatementUseCase = new CreateStatementUseCase(
    usersRepository,
    statementRepository
  );

  const statement: any = {
    user_id: "fake",
    type: "type-fake",
    amount: 15.5,
    description: "description-fake",
  };

  beforeEach(() => {
    jest.spyOn(usersRepository, "findById");
    jest.spyOn(statementRepository, "create");
  });

  describe("execute()", () => {
    describe("When error", () => {
      it("Should be able to have be called findById and throw new CreateStatementErro", async () => {
        let error;
        try {
          await createStatementUseCase.execute(statement);
        } catch (err) {
          error = err;
        }

        expect(error).toEqual({ message: "User not found", statusCode: 404 });
        expect(usersRepository.findById).toHaveBeenCalledWith("fake");
      });
    });

    describe("When success", () => {
      it("Should be able findById", async () => {
        const user = await usersRepository.create({
          name: "Joao",
          email: "joao@teste.com",
          password: "123",
        });

        const newStatement = {
          user_id: user.id,
          type: "teste",
          amount: "teste",
          description: "fake",
        };

        try {
          await createStatementUseCase.execute(newStatement as any);
        } catch (err) {}

        expect(usersRepository.findById).toHaveBeenCalledWith(user.id);
      });
    });

    it("Should call statementsRepository.create passing parameters valid", async () => {
      const user = await usersRepository.create({
        name: "Joao",
        email: "joao@teste.com",
        password: "123",
      });

      const newStatement = {
        user_id: user.id,
        type: "teste",
        amount: "teste",
        description: "fake",
      };

      try {
        await createStatementUseCase.execute(newStatement as any);
      } catch (err) {}

      expect(statementRepository.create).toHaveBeenCalledWith(newStatement);
      expect(usersRepository.findById).toHaveBeenCalledWith(user.id);
    });
  });
});
