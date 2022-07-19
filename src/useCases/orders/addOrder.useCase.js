const { isEmpty } = require("lodash");
const { Order } = require("../../entities");
const { ResponseError, validationError } = require("../../frameworks/common");

module.exports = (dependencies) => {
  const {
    ordersRepository,
    useCases: {
      user: { getUserByIdUseCase },
      product: { getProductByIdUseCase },
    },
  } = dependencies;

  if (!ordersRepository) {
    throw new Error("The orders repository should be exist in dependencies");
  }

  if (!getUserByIdUseCase) {
    throw new Error("getUserByIdUseCase should be exist in dependencies");
  }

  if (!getProductByIdUseCase) {
    throw new Error("getProductByIdUseCase should be exist in dependencies");
  }

  const getUserById = getUserByIdUseCase(dependencies).execute;
  const getProductById = getProductByIdUseCase(dependencies).execute;

  const getValidationErrors = async ({ order }) => {
    const returnable = [];

    const { productsIds = [], userId } = order;
    const products = await Promise.all(
      productsIds.map((id) => getProductById({ id }))
    );

    const notFoundProductsIds = products.reduce((acc, product, i) => {
      if (!product) {
        acc.push(productsIds[i]);
      }
      return acc;
    }, []);

    if (!isEmpty(notFoundProductsIds)) {
      returnable.push(
        new validationError({
          field: "productsIds",
          msg: `No products with ids ${notFoundProductsIds.join(", ")}`,
        })
      );
    }

    const user = await getUserById({ id: userId });
    if (!user) {
      returnable.push(
        new validationError({
          field: "userId",
          msg: `No user with id ${userId}`,
        })
      );
    }
    return returnable;
  };

  const execute = async ({ userId, productsIds, date, isPayed, meta }) => {
    const order = new Order({
      userId,
      productsIds,
      date,
      isPayed,
      meta,
    });

    const validationErrors = await getValidationErrors({
      order,
    });
    if (!isEmpty(validationErrors)) {
      return Promise.reject(
        new ResponseError({
          status: 403,
          msg: "Validation Errors",
          reason: "Somebody sent bad data",
          validationErrors,
        })
      );
    }

    return ordersRepository.add(order);
  };

  return {
    execute,
  };
};
