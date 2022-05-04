const mongoose = require("mongoose");

const NotifyTypeSchema = mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    default: "",
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

NotifyTypeSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

NotifyTypeSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("NotifyType", NotifyTypeSchema);
