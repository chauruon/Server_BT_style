const mongoose = require("mongoose");

const HotSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  images: {
    type: Array,
    default: [],
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    default: "",
    required: String,
  },
});

HotSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

HotSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Hot", HotSchema);
