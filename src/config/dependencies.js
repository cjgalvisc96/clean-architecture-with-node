const useCases = require("../useCases");
// const repositories = require("../frameworks/repositories/inMemory"); *Benefit CleanArchitecture
const repositories = require("../frameworks/repositories/mongo");

module.exports = {
  useCases,
  ...repositories,
};
