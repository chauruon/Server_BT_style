const mongoose = require("mongoose");

const Comment_replySchema = mongoose.Schema({
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
  comment: {
    type: String,
    default: "",
    required: true,
  },
});

Comment_replySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

Comment_replySchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Comment_reply", Comment_replySchema);
