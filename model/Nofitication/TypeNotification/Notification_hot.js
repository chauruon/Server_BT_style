const mongoose = require("mongoose");

const Notification_hotSchema = mongoose.Schema({
  PeopleLiked: {
    type: String,
    default: "",
  },
  wholiked: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  status: {
    type: Number,
    default: 1,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hot_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hot",
    required: true,
  },
  NotifyType_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NotifyType",
    required: true,
  },
});

Notification_hotSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

Notification_hotSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Notification_hot", Notification_hotSchema);
