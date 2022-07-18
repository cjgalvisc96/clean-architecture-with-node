const { Product } = require("../../entities");

module.exports = (dependencies) => {
  const { productsRepository } = dependencies;
  if (!productsRepository) {
    throw new Error("The products repository should be exist in dependencies");
  }

  const execute = ({ name, description, images, price, color, meta }) => {
    const product = new Product({
      name,
      description,
      images,
      price,
      color,
      meta,
    });

    return productsRepository.add(product);
  };

  return {
    execute,
  };
};
