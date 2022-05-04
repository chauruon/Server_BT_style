const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  RatingValue: {
    type: Number,
  },
  DateCreated: {
    type: Date,
    default: Date.now(),
  },
  Review: {
    type: String,
  },
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
