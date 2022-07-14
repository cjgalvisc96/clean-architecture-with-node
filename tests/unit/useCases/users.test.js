const {
  user: { addUserUseCase },
} = require("../../../src/useCases");

const {
  User,
  constants: {
    userConstants: { genders },
  },
} = require("../../../src/entities");

const { v4: uuidv4 } = require("uuid");

const Chance = require("chance");

const chance = new Chance();

describe("User use cases", () => {
  const mockUserRepo = {
    add: jest.fn(async (user) => ({
      ...user,
      id: uuidv4(),
    })),
  };

  const dependencies = {
    usersRepository: mockUserRepo,
  };

  describe("Add user use case", () => {
    test("User should be added", async () => {
      // create a user data
      const testUserData = {
        name: chance.name(),
        lastName: chance.last(),
        gender: genders.MALE,
        meta: {
          hair: {
            color: "Red",
          },
        },
      };

      // add a user using the use case
      const addedUser = await addUserUseCase(dependencies).execute(
        testUserData
      );

      // check the received data
      expect(addedUser).toBeDefined();
      expect(addedUser.id).toBeDefined();
      expect(addedUser.name).toBe(testUserData.name);
      expect(addedUser.lastName).toBe(testUserData.lastName);
      expect(addedUser.gender).toBe(testUserData.gender);
      expect(addedUser.meta).toEqual(testUserData.meta);

      // check that the dependencies called as expected
      const call = mockUserRepo.add.mock.calls[0][0];
      expect(call.id).toBeUndefined();
      expect(call.name).toBe(testUserData.name);
      expect(call.lastName).toBe(testUserData.lastName);
      expect(call.gender).toBe(testUserData.gender);
      expect(call.meta).toEqual(testUserData.meta);
    });
  });
});
