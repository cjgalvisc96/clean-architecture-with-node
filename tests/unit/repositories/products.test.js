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
    const testProduct = new Product({
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

    const addedProduct = await productsRepository.add(testProduct);

    expect(addedProduct).toBeDefined();
    expect(addedProduct.id).toBeDefined();
    expect(addedProduct.name).toBeDefined();
    expect(addedProduct.description).toBeDefined();
    expect(addedProduct.images).toBeDefined();
    expect(addedProduct.price).toBeDefined();
    expect(addedProduct.color).toBeDefined();
    expect(addedProduct.meta).toBeDefined();

    // Get the product
    const returnedProduct = await productsRepository.getById(addedProduct.id);
    expect(returnedProduct).toEqual(addedProduct);
  });

  test("New product should be deleted", async () => {
    // Init two products
    const willBeDeletedProduct = new Product({
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
    const shouldStayProduct = new Product({
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
    const [willBeDeletedaddedProduct, shouldStayaddedProduct] =
      await Promise.all([
        productsRepository.add(willBeDeletedProduct),
        productsRepository.add(shouldStayProduct),
      ]);
    expect(willBeDeletedaddedProduct).toBeDefined();
    expect(shouldStayaddedProduct).toBeDefined();

    // Delete one product()
    const deletedProduct = await productsRepository.delete(
      willBeDeletedaddedProduct
    );
    expect(deletedProduct).toEqual(willBeDeletedaddedProduct);

    // Try to get deleted product(should be undefined)
    const shouldBeUndefinedProduct = await productsRepository.getById(
      deletedProduct.id
    );
    expect(shouldBeUndefinedProduct).toBeUndefined();

    // Check that the second product defined(not deleted)
    const shouldBeDefinedProduct = await productsRepository.getById(
      shouldStayaddedProduct.id
    );
    expect(shouldBeDefinedProduct).toBeDefined();
  });

  test("New product should be updated", async () => {
    // Added a product
    const testProduct = new Product({
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

    const addedProduct = await productsRepository.add(testProduct);
    expect(addedProduct).toBeDefined();

    // Update a product
    const clonedProduct = cloneDeep({
      ...addedProduct,
      name: chance.name(),
      meta: {
        deliver: {
          from: "Malta",
        },
      },
    });
    const updatedProduct = await productsRepository.update(clonedProduct);
    expect(updatedProduct).toEqual(clonedProduct);
  });
});
