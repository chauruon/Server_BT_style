const mongoose = require("mongoose");

const Comment_likeSchema = mongoose.Schema({
  comment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
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
    required: true,
  },
});

Comment_likeSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

Comment_likeSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Comment_like", Comment_likeSchema);
