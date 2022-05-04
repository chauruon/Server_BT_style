const mongoose = require("mongoose");

const FavoriteSchema = mongoose.Schema({
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
  isFavorite: {
    type: Boolean,
    default: false,
    required: true,
  },
});

FavoriteSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

FavoriteSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Favorite", FavoriteSchema);
