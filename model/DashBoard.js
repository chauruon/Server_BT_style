const mongoose = require("mongoose");

const DashBoardSchema = mongoose.Schema({
  title: {
    type: String,
    default: "",
  },
  Date: {
    type: Date,
    default: Date.now(),
  },
  Styles: [
    {
      title: {
        type: String,
        default: "",
      },
      image: {
        type: String,
        default: "",
      },
    },
  ],
  theloai_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});
module.exports = mongoose.model("DashBoard", DashBoardSchema);
