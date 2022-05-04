const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const NotifyType = require("../../model/Nofitication/NotifyType");

//lấy tất cả thông báo
router.get("/", async (req, res) => {
  const NofityTypes = await NotifyType.find();

  if (!NofityTypes) {
    res.status(500).json({
      success: false,
    });
  }
  res.status(200).send(NofityTypes);
});

//Thêm một thông báo mới
router.post("/", async (req, res) => {
  let notify = new NotifyType({
    name: req.body.name,
    content: req.body.content,
  });
  notify = await notify.save();

  if (!notify) return res.status(400).send("the Notice cannot be created!");

  res.send(notify);
});

module.exports = router;
