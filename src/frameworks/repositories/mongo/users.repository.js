const mongoose = require("mongoose");
const entityName = "User";
const {
  schemas: { user: userSchema },
} = require("../../database/mongo");

const repository = () => {
  // Schema
  const User = mongoose.model(entityName, userSchema);

  // CRUD
  return {
    add: async (user) => {
      const mongoObject = new User(user);
      return mongoObject.save();
    },
    update: async (user) => {
      const { id } = user;
      delete user.id;
      return User.findByIdAndUpdate(
        id,
        {
          ...user,
          updateAt: new Date(),
        },
        {
          new: true,
        }
      ).lean();
    },
    delete: async (user) => {
      const { id } = user;
      delete user.id;
      return User.findByIdAndUpdate(
        id,
        {
          ...user,
          deleteAt: new Date(),
        },
        {
          new: true,
        }
      ).lean();
    },
    getById: async (id) => {
      return User.findOne({ _id: id, deleteAt: { $exists: false } });
    },
  };
};

module.exports = repository();
