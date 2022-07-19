const {
  order: {
    addOrderUseCase,
    getOrderByIdUseCase,
    updateOrderUseCase,
    deleteOrderUseCase,
  },
  user: { getUserByIdUseCase, addUserUseCase },
  product: { getProductByIdUseCase, addProductUseCase },
  product,
} = require("../../../src/useCases");

const { Order } = require("../../../src/entities");

const {
  constants: {
    userConstants: { genders },
  },
} = require("../../../src/entities");

const { v4: uuidv4 } = require("uuid");

const { cloneDeep, before } = require("lodash");

const {
  usersRepository,
  productsRepository,
} = require("../../../src/frameworks/repositories/inMemory");

const { ValidationError } = require("../../../src/frameworks/common");

const Chance = require("chance");

const chance = new Chance();

describe("Order use cases", () => {
  let testOrder;
  const mockOrderRepo = {
    add: jest.fn(async (order) => ({
      ...order,
      id: uuidv4(),
    })),
    getById: jest.fn(async (id) => ({
      id,
      userId: uuidv4(),
      productsIds: [uuidv4(), uuidv4()],
      date: new Date(),
      isPayed: false,
      meta: {
        comment: chance.sentence(),
      },
    })),
    update: jest.fn(async (order) => order),
    delete: jest.fn(async (order) => order),
  };

  const dependencies = {
    ordersRepository: mockOrderRepo,
    usersRepository,
    productsRepository,
    useCases: {
      user: {
        getUserByIdUseCase: jest.fn((dependencies) =>
          getUserByIdUseCase(dependencies)
        ),
      },
      product: {
        getProductByIdUseCase: jest.fn((dependencies) =>
          getProductByIdUseCase(dependencies)
        ),
      },
    },
  };

  const mocks = {};
  beforeAll(async () => {
    const addProduct = addProductUseCase(dependencies).execute;
    const addUser = addUserUseCase(dependencies).execute;

    mocks.products = await Promise.all(
      [1, 2, 3].map(() =>
        addProduct({
          name: chance.name(),
          description: chance.sentence(),
          images: [chance.url()],
          price: chance.natural(),
          color: chance.color(),
          meta: {
            review: chance.sentence(),
          },
        })
      )
    );

    mocks.users = await Promise.all(
      [1, 2, 3].map(() =>
        addUser({
          name: chance.name(),
          lastName: chance.last(),
          gender: genders.NOT_SPECIFIED,
          meta: {
            review: chance.sentence(),
          },
        })
      )
    );

    testOrder = new Order({
      userId: mocks.users[0].id,
      productsIds: mocks.products.map((product) => product.id),
      date: new Date(),
      isPayed: false,
      meta: {
        comment: chance.sentence(),
      },
    });
  });

  describe("Add order use case", () => {
    test("Order should be added", async () => {
      // add a order using the use case
      const addedOrder = await addOrderUseCase(dependencies).execute(testOrder);

      // check the received data
      expect(addedOrder).toBeDefined();
      expect(addedOrder.id).toBeDefined();
      expect(addedOrder.userId).toBe(testOrder.userId);
      expect(addedOrder.productsIds).toEqual(testOrder.productsIds);
      expect(addedOrder.date).toEqual(testOrder.date);
      expect(addedOrder.isPayed).toBe(testOrder.isPayed);
      expect(addedOrder.meta).toEqual(testOrder.meta);

      // check that the dependencies called as expected
      const call = mockOrderRepo.add.mock.calls[0][0];
      expect(call.id).toBeUndefined();
      expect(call.userId).toBe(testOrder.userId);
      expect(call.productsIds).toEqual(testOrder.productsIds);
      expect(call.date).toEqual(testOrder.date);
      expect(call.isPayed).toEqual(testOrder.isPayed);
      expect(call.meta).toEqual(testOrder.meta);
    });

    test("Should return validation error when product id unknown", async () => {
      const fakeId = uuidv4();
      try {
        // call add order
        await addOrderUseCase(dependencies).execute({
          ...testOrder,
          productsIds: [...testOrder.productsIds, fakeId],
        });
        expect(true).toBe(false);
      } catch (err) {
        expect(err.status).toBe(403);
        expect(err.validationErrors).toEqual([
          new ValidationError({
            field: "productsIds",
            msg: `No products with ids ${fakeId}`,
          }),
        ]);
      }
    });

    test("Should return validation error when user id unknown", async () => {
      const fakeId = uuidv4();
      try {
        // call add order
        await addOrderUseCase(dependencies).execute({
          ...testOrder,
          userId: fakeId,
        });
        expect(true).toBe(false);
      } catch (err) {
        expect(err.status).toBe(403);
        expect(err.validationErrors).toEqual([
          new ValidationError({
            field: "userId",
            msg: `No user with id ${fakeId}`,
          }),
        ]);
      }
    });
  });

  describe("Get order use case", () => {
    test("Order should ne returned by id", async () => {
      // Generate a fake id
      const fakeId = uuidv4();
      // Call get order by id
      const orderById = await getOrderByIdUseCase(dependencies).execute({
        id: fakeId,
      });
      // Check the data
      expect(orderById).toBeDefined();
      expect(orderById.id).toBe(fakeId);
      expect(orderById.userId).toBeDefined();
      expect(orderById.productsIds).toBeDefined();
      expect(orderById.date).toBeDefined();
      expect(orderById.isPayed).toBeDefined();
      expect(orderById.meta).toBeDefined();

      // Check the mock
      const expectedId = mockOrderRepo.getById.mock.calls[0][0];
      expect(expectedId).toBe(fakeId);
    });
  });

  describe("Update order use case", () => {
    test("Order should be updated", async () => {
      // Call update a order
      const updatedOrder = await updateOrderUseCase(dependencies).execute({
        order: testOrder,
      });

      // Check the result
      expect(updatedOrder).toEqual(testOrder);

      // Check the call
      const expectedOrder = mockOrderRepo.update.mock.calls[0][0];
      expect(expectedOrder).toEqual(testOrder);
    });
  });

  describe("Delete order use case", () => {
    test("Order should be deleted", async () => {
      // Create a order data
      const mockOrder = {
        ...testOrder,
        id: uuidv4(),
      };
      // Call update a order
      const deletedOrder = await deleteOrderUseCase(dependencies).execute({
        order: cloneDeep(mockOrder),
      });

      // Check the result
      expect(deletedOrder).toEqual(mockOrder);

      // Check the call
      const expectedOrder = mockOrderRepo.delete.mock.calls[0][0];
      expect(expectedOrder).toEqual(mockOrder);
    });
  });
});
