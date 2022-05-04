const mongoose = require("mongoose");

const LikeSchema = mongoose.Schema({
  hot_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hot",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
});

LikeSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

LikeSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Like", LikeSchema);
