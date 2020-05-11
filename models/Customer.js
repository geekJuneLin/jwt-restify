const mongoose = require("mongoose");
const mongooseTimestamp = require("mongoose-timestamp");

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    default: 0,
  },
});

CustomerSchema.plugin(mongooseTimestamp);

module.exports = Customer = mongoose.connection
  .useDb("restify")
  .model("customer", CustomerSchema);
