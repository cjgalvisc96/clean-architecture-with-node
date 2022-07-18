const {
  user: { addUserUseCase, getUserByIdUseCase },
} = require("../../../src/useCases");

const {
  User,
  constants: {
    userConstants: { genders },
  },
} = require("../../../src/entities");

const { v4: uuidv4 } = require("uuid");

const { cloneDeep } = require("lodash");

const Chance = require("chance");
const updateUserUseCase = require("../../../src/useCases/users/updateUser.useCase");
const { deleteUserUseCase } = require("../../../src/useCases/users");

const chance = new Chance();

describe("User use cases", () => {
  const testUser = new User({
    name: chance.name(),
    lastName: chance.last(),
    gender: genders.MALE,
    meta: {
      hair: {
        color: "Red",
      },
    },
  });
  const mockUserRepo = {
    add: jest.fn(async (user) => ({
      ...user,
      id: uuidv4(),
    })),
    getById: jest.fn(async (id) => ({
      id,
      name: chance.name(),
      lastName: chance.last(),
      gender: genders.NOT_SPECIFIED,
      meta: {},
    })),
    update: jest.fn(async (user) => user),
    delete: jest.fn(async (user) => user),
  };

  const dependencies = {
    usersRepository: mockUserRepo,
  };

  describe("Add user use case", () => {
    test("User should be added", async () => {
      // add a user using the use case
      const addedUser = await addUserUseCase(dependencies).execute(testUser);

      // check the received data
      expect(addedUser).toBeDefined();
      expect(addedUser.id).toBeDefined();
      expect(addedUser.name).toBe(testUser.name);
      expect(addedUser.lastName).toBe(testUser.lastName);
      expect(addedUser.gender).toBe(testUser.gender);
      expect(addedUser.meta).toEqual(testUser.meta);

      // check that the dependencies called as expected
      const call = mockUserRepo.add.mock.calls[0][0];
      expect(call.id).toBeUndefined();
      expect(call.name).toBe(testUser.name);
      expect(call.lastName).toBe(testUser.lastName);
      expect(call.gender).toBe(testUser.gender);
      expect(call.meta).toEqual(testUser.meta);
    });
  });

  describe("Get user use case", () => {
    test("User should ne returned by id", async () => {
      // Generate a fake id
      const fakeId = uuidv4();
      // Call get user by id
      const userById = await getUserByIdUseCase(dependencies).execute({
        id: fakeId,
      });
      // Check the data
      expect(userById).toBeDefined();
      expect(userById.id).toBe(fakeId);
      expect(userById.name).toBeDefined();
      expect(userById.lastName).toBeDefined();
      expect(userById.gender).toBeDefined();
      expect(userById.meta).toBeDefined();

      // Check the mock
      const expectedId = mockUserRepo.getById.mock.calls[0][0];
      expect(expectedId).toBe(fakeId);
    });
  });

  describe("Update user use case", () => {
    test("User should be updated", async () => {
      // Call update a user
      const updatedUser = await updateUserUseCase(dependencies).execute({
        user: testUser,
      });

      // Check the result
      expect(updatedUser).toEqual(testUser);

      // Check the call
      const expectedUser = mockUserRepo.update.mock.calls[0][0];
      expect(expectedUser).toEqual(testUser);
    });
  });

  describe("Delete user use case", () => {
    test("User should be deleted", async () => {
      // Create a user data
      const mockUser = {
        ...testUser,
        id: uuidv4(),
      };
      // Call update a user
      const deletedUser = await deleteUserUseCase(dependencies).execute({
        user: cloneDeep(mockUser),
      });

      // Check the result
      expect(deletedUser).toEqual(mockUser);

      // Check the call
      const expectedUser = mockUserRepo.delete.mock.calls[0][0];
      expect(expectedUser).toEqual(mockUser);
    });
  });
});
