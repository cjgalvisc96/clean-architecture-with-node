const Chance = require("chance");

const chance = new Chance();

const { cloneDeep } = require("lodash");

const {
  productsRepository,
} = require("../../../src/frameworks/repositories/inMemory");

const { Product } = require("../../../src/entities");

describe("products repository", () => {
  test("New product should be added and returned", async () => {
    // Create a new Product
    const testproduct = new Product({
      name: chance.name(),
      description: chance.sentence(),
      images: [chance.url(), chance.url()],
      price: chance.natural(),
      color: chance.color(),
      meta: {
        deliver: {
          from: "China",
        },
      },
    });

    const addedproduct = await productsRepository.add(testproduct);

    expect(addedproduct).toBeDefined();
    expect(addedproduct.id).toBeDefined();
    expect(addedproduct.name).toBeDefined();
    expect(addedproduct.description).toBeDefined();
    expect(addedproduct.images).toBeDefined();
    expect(addedproduct.price).toBeDefined();
    expect(addedproduct.color).toBeDefined();
    expect(addedproduct.meta).toBeDefined();

    // Get the product
    const returnedproduct = await productsRepository.getById(addedproduct.id);
    expect(returnedproduct).toEqual(addedproduct);
  });

  test("New product should be deleted", async () => {
    // Init two products
    const willBeDeletedproduct = new Product({
      name: chance.name(),
      description: chance.sentence(),
      images: [chance.url(), chance.url()],
      price: chance.natural(),
      color: chance.color(),
      meta: {
        deliver: {
          from: "China",
        },
      },
    });
    const shouldStayproduct = new Product({
      name: chance.name(),
      description: chance.sentence(),
      images: [chance.url(), chance.url()],
      price: chance.natural(),
      color: chance.color(),
      meta: {
        deliver: {
          from: "Malta",
        },
      },
    });

    // Add two products
    const [willBeDeletedAddedproduct, shouldStayAddedproduct] =
      await Promise.all([
        productsRepository.add(willBeDeletedproduct),
        productsRepository.add(shouldStayproduct),
      ]);
    expect(willBeDeletedAddedproduct).toBeDefined();
    expect(shouldStayAddedproduct).toBeDefined();

    // Delete one product()
    const deletedproduct = await productsRepository.delete(
      willBeDeletedAddedproduct
    );
    expect(deletedproduct).toEqual(willBeDeletedAddedproduct);

    // Try to get deleted product(should be undefined)
    const shouldBeUndefinedproduct = await productsRepository.getById(
      deletedproduct.id
    );
    expect(shouldBeUndefinedproduct).toBeUndefined();

    // Check that the second product defined(not deleted)
    const shouldBeDefinedproduct = await productsRepository.getById(
      shouldStayAddedproduct.id
    );
    expect(shouldBeDefinedproduct).toBeDefined();
  });

  test("New product should be updated", async () => {
    // Added a product
    const testproduct = new Product({
      name: chance.name(),
      description: chance.sentence(),
      images: [chance.url(), chance.url()],
      price: chance.natural(),
      color: chance.color(),
      meta: {
        deliver: {
          from: "China",
        },
      },
    });

    const addedproduct = await productsRepository.add(testproduct);
    expect(addedproduct).toBeDefined();

    // Update a product
    const clonedproduct = cloneDeep({
      ...addedproduct,
      name: chance.name(),
      meta: {
        deliver: {
          from: "Malta",
        },
      },
    });
    const updatedproduct = await productsRepository.update(clonedproduct);
    expect(updatedproduct).toEqual(clonedproduct);
  });
});
