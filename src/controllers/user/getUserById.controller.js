const { Response } = require("../../frameworks/common");

module.exports = (dependencies) => {
  const {
    useCases: {
      user: { getUserByIdUseCase },
    },
  } = dependencies;
  return async (req, res, next) => {
    try {
      const { params = {} } = req;
      const { id } = params;

      const getUserById = getUserByIdUseCase(dependencies);
      const response = getUserById.execute({
        id,
      });

      res.json(
        new Response({
          status: true,
          content: response,
        })
      );
      next();
    } catch (error) {
      next(error);
    }
  };
};