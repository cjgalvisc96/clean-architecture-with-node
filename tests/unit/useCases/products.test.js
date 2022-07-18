const {
  product: {
    addProductUseCase,
    getProductByIdUseCase,
    updateProductUseCase,
    deleteProductUseCase,
  },
} = require("../../../src/useCases");

const { v4: uuidv4 } = require("uuid");

const { cloneDeep } = require("lodash");

const Chance = require("chance");
const { Product } = require("../../../src/entities");

const chance = new Chance();

describe("Product use cases", () => {
  const testProduct = new Product({
    name: chance.name(),
    description: chance.sentence(),
    images: [chance.url()],
    price: chance.natural(),
    color: chance.color(),
    meta: {
      comment: chance.sentence(),
    },
  });
  const mockProductRepo = {
    add: jest.fn(async (product) => ({
      ...product,
      id: uuidv4(),
    })),
    getById: jest.fn(async (id) => ({
      id,
      name: chance.name(),
      description: chance.sentence(),
      images: [chance.url()],
      price: chance.natural(),
      color: chance.color(),
      meta: {
        comment: chance.sentence(),
      },
    })),
    update: jest.fn(async (product) => product),
    delete: jest.fn(async (product) => product),
  };

  const dependencies = {
    productsRepository: mockProductRepo,
  };

  describe("Add product use case", () => {
    test("New Product should be added", async () => {
      // add a product using the use case
      const addedProduct = await addProductUseCase(dependencies).execute(
        testProduct
      );

      // check the received data
      expect(addedProduct).toBeDefined();
      expect(addedProduct.id).toBeDefined();
      expect(addedProduct.name).toBe(testProduct.name);
      expect(addedProduct.description).toBe(testProduct.description);
      expect(addedProduct.images).toEqual(testProduct.images);
      expect(addedProduct.price).toBe(testProduct.price);
      expect(addedProduct.color).toBe(testProduct.color);
      expect(addedProduct.meta).toEqual(testProduct.meta);

      // check that the dependencies called as expected
      const call = mockProductRepo.add.mock.calls[0][0];
      expect(call.id).toBeUndefined();
      expect(call.name).toBe(testProduct.name);
      expect(call.description).toBe(testProduct.description);
      expect(call.images).toEqual(testProduct.images);
      expect(call.price).toBe(testProduct.price);
      expect(call.color).toBe(testProduct.color);
      expect(call.meta).toEqual(testProduct.meta);
    });
  });

  describe("Get product use case", () => {
    test("Product should be returned by id", async () => {
      // Generate a fake id
      const fakeId = uuidv4();
      // Call get product by id
      const productById = await getProductByIdUseCase(dependencies).execute({
        id: fakeId,
      });
      // Check the data
      expect(productById).toBeDefined();
      expect(productById.id).toBe(fakeId);
      expect(productById.name).toBeDefined();
      expect(productById.description).toBeDefined();
      expect(productById.images).toBeDefined();
      expect(productById.price).toBeDefined();
      expect(productById.color).toBeDefined();
      expect(productById.meta).toBeDefined();

      // Check the mock
      const expectedId = mockProductRepo.getById.mock.calls[0][0];
      expect(expectedId).toBe(fakeId);
    });
  });

  describe("Update product use case", () => {
    test("Product should be updated", async () => {
      // Create a product data
      const mockProduct = {
        ...testProduct,
        id: uuidv4(),
      };
      // Call update a product
      const updatedProduct = await updateProductUseCase(dependencies).execute({
        product: cloneDeep(mockProduct),
      });

      // Check the result
      expect(updatedProduct).toEqual(mockProduct);

      // Check the call
      const expectedProduct = mockProductRepo.update.mock.calls[0][0];
      expect(expectedProduct).toEqual(mockProduct);
    });
  });

  describe("Delete product use case", () => {
    test("Product should be deleted", async () => {
      // Create a product data
      const mockProduct = {
        ...testProduct,
        id: uuidv4(),
      };
      // Call update a product
      const deletedProduct = await deleteProductUseCase(dependencies).execute({
        product: cloneDeep(mockProduct),
      });

      // Check the result
      expect(deletedProduct).toEqual(mockProduct);

      // Check the call
      const expectedProduct = mockProductRepo.delete.mock.calls[0][0];
      expect(expectedProduct).toEqual(mockProduct);
    });
  });
});
