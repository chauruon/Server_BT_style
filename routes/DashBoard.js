const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const DashBoard = require("../model/DashBoard");

//lấy tất cả thông báo
router.get("/", async (req, res) => {
  const DashBoardList = await DashBoard.find();

  if (!DashBoardList) {
    res.status(500).json({
      success: false,
    });
  }
  res.status(200).send(DashBoardList);
});

//Thêm một dashboard moi by id the loai
router.post("/", async (req, res) => {
  let dashboard = new DashBoard({
    title: req.body.title,
    Styles: req.body.Styles,
    theloai_id: req.body.theloai_id,
  });
  dashboard = await dashboard.save();

  if (!dashboard)
    return res.status(400).send("The dashboard cannot be created!");

  res.send(dashboard);
});

//Thêm một dashboard moi by id the loai
router.put("/:id", async (req, res) => {
  let dashboard = new DashBoard({
    title: req.body.title,
    Styles: req.body.Styles,
    theloai_id: req.params.id,
  });
  dashboard = await dashboard.save();

  if (!dashboard)
    return res.status(400).send("The dashboard cannot be created!");

  res.send(dashboard);
});

/**
 * cập nhật styles dashboard
 * @param {id}
 */
router.put(`/styles/:id`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Product Id");
  }
  const { Styles } = req.body;

  const updatedDashBoard = await DashBoard.findByIdAndUpdate(
    req.params.id,
    {
      $push: { Styles },
    },
    { upsert: true }
  );

  if (!updatedDashBoard) {
    return res.status(500).send("the product cannot be updated!");
  }

  res.send(updatedDashBoard);
});

/**
 * remove dashboard by id dashboard
 *@param {id}
 */
router.delete("/:id", (req, res) => {
  DashBoard.findByIdAndRemove(req.params.id)
    .then((dashboard) => {
      if (dashboard) {
        return res.status(200).json({
          success: true,
          message: "the dashboard is deleted!",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "dashboard not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
