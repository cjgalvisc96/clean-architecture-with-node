module.exports = (dependencies) => {
  const { productsRepository } = dependencies;
  if (!productsRepository) {
    throw new Error("The products repository should be exist in dependencies");
  }

  const execute = ({ product = {} }) => {
    return productsRepository.update(product);
  };

  return {
    execute,
  };
};
