const Chance = require("chance");

const chance = new Chance();

const { v4: uuidv4 } = require("uuid");

const { cloneDeep } = require("lodash");

const {
  ordersRepository,
} = require("../../../src/frameworks/repositories/inMemory");

const { Order } = require("../../../src/entities");

describe("Orders repository", () => {
  test("New Order should be added and returned", async () => {
    // Add a new order
    const testOrder = new Order({
      userId: uuidv4(),
      productsIds: [uuidv4(), uuidv4()],
      date: new Date(),
      isPayed: true,
      meta: {
        comment: chance.sentence(),
      },
    });

    const addedOrder = await ordersRepository.add(testOrder);

    // Check the order
    expect(addedOrder).toBeDefined();
    expect(addedOrder.id).toBeDefined();
    expect(addedOrder.productsIds).toEqual(testOrder.productsIds);
    expect(addedOrder.date).toEqual(testOrder.date);
    expect(addedOrder.isPayed).toBe(testOrder.isPayed);
    expect(addedOrder.meta).toEqual(testOrder.meta);

    // Get the order
    const returnedOrder = await ordersRepository.getById(addedOrder.id);
    expect(returnedOrder).toEqual(addedOrder);
  });

  test("New Order should be deleted", async () => {
    // Init two orders
    const willBeDeletedOrder = new Order({
      userId: uuidv4(),
      productsIds: [uuidv4(), uuidv4()],
      date: new Date(),
      isPayed: true,
      meta: {
        comment: chance.sentence(),
      },
    });
    const shouldStayOrder = new Order({
      userId: uuidv4(),
      productsIds: [uuidv4(), uuidv4()],
      date: new Date(),
      isPayed: true,
      meta: {
        comment: chance.sentence(),
      },
    });

    // Add two order
    const [willBeDeletedAddedOrder, shouldStayAddedOrder] = await Promise.all([
      ordersRepository.add(willBeDeletedOrder),
      ordersRepository.add(shouldStayOrder),
    ]);
    expect(willBeDeletedAddedOrder).toBeDefined();
    expect(shouldStayAddedOrder).toBeDefined();

    // Delete one order()
    const deletedOrder = await ordersRepository.delete(willBeDeletedAddedOrder);
    expect(deletedOrder).toEqual(willBeDeletedAddedOrder);

    // Try to get deleted order(should be undefined)
    const shouldBeUndefinedOrder = await ordersRepository.getById(
      deletedOrder.id
    );
    expect(shouldBeUndefinedOrder).toBeUndefined();

    // Check that the second order defined(not deleted)
    const shouldBeDefinedOrder = await ordersRepository.getById(
      shouldStayAddedOrder.id
    );
    expect(shouldBeDefinedOrder).toBeDefined();
  });

  test("New order should be updated", async () => {
    // Added a Order
    const testOrder = new Order({
      userId: uuidv4(),
      productsIds: [uuidv4(), uuidv4()],
      date: new Date(),
      isPayed: true,
      meta: {
        comment: chance.sentence(),
      },
    });

    const addedOrder = await ordersRepository.add(testOrder);
    expect(addedOrder).toBeDefined();

    // Update a order
    const clonedOrder = cloneDeep({
      ...addedOrder,
      isPayed: false,
      productsIds: [...testOrder.productsIds, uuidv4()],
    });
    const updatedOrder = await ordersRepository.update(clonedOrder);
    expect(updatedOrder).toEqual(clonedOrder);
  });
});
