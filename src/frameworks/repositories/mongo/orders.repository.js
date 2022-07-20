const mongoose = require("mongoose");
const entityName = "Order";
const {
  schemas: { order: orderSchema },
} = require("../../database/mongo");

const repository = () => {
  // Schema
  const Order = mongoose.model(entityName, orderSchema);

  // CRUD
  return {
    add: async (order) => {
      const mongoObject = new Order(order);
      return mongoObject.save();
    },
    update: async (order) => {
      const { id } = order;
      delete order.id;
      return Order.findByIdAndUpdate(
        id,
        {
          ...order,
          updateAt: new Date(),
        },
        {
          new: true,
        }
      ).lean();
    },
    delete: async (order) => {
      const { id } = order;
      delete order.id;
      return Order.findByIdAndUpdate(
        id,
        {
          ...order,
          deleteAt: new Date(),
        },
        {
          new: true,
        }
      ).lean();
    },
    getById: async (id) => {
      return Order.findOne({ _id: id, deleteAt: { $exists: false } });
    },
  };
};

module.exports = repository();
