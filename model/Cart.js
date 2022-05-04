const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  imageSp: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Cart", cartSchema);
