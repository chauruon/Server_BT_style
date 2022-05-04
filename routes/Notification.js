const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Notification = require("../model/Notification");

//lấy tất cả thông báo
router.get("/", async (req, res) => {
  const NofificationList = await Notification.find();

  if (!NofificationList) {
    res.status(500).json({
      success: false,
    });
  }
  res.status(200).send(NofificationList);
});

//Thêm một thông báo mới
router.post("/:id", async (req, res) => {
  let notify = new Notification({
    title: req.body.title,
    img: req.body.image,
    body: req.body.color,
    loaitb: req.body.loaitb,
    user_id: req.params.id,
  });
  notify = await notify.save();

  if (!notify) return res.status(400).send("the Notice cannot be created!");

  res.send(notify);
});

module.exports = router;
