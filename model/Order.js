const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  note: {
    type: String,
    default: "",
  },
  Payment: {
    type: String,
    default: "",
  },
  dateOrdered: {
    type: Date,
    default: Date.now(),
  },
  orderitems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItems",
      required: true,
      default: "",
    },
  ],
  imageSp: {
    type: String,
    default: "image",
  },
  size: {
    type: String,
    default: "size",
  },
  color: {
    type: String,
    default: "color",
  },
  country: {
    type: String,
    default: "VN",
  },
  city: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: 0,
  },
  fullname: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  priceVoucher: {
    type: Number,
    default: "",
  },
  totalPrice: {
    type: Number,
    default: "",
  },
  totalFinalPrice: {
    type: Number,
    default: "",
  },
  lydohuy: {
    type: String,
    default: "",
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Order", orderSchema);
