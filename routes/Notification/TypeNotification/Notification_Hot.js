const NotificationHot = require("../../../model/Nofitication/TypeNotification/Notification_hot");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

/**
 * Lấy tất cả Notification Event
 */
router.get("/", async (req, res) => {
  const notifyList = await NotificationHot.find().populate([
    "user_id",
    "NotifyType_id",
    "wholiked",
  ]);

  if (!notifyList) {
    res.status(500).json({
      success: false,
    });
  }
  res.status(200).send(notifyList);
});

// find by id notification hot
router.get(`/:id`, async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send("Invalid notify id");
  }

  const notify = await NotificationHot.findById(id)
    .populate(["user_id", "NotifyType_id", "wholiked"])
    .sort({ dateCreated: -1 });

  if (!notify) {
    res.status(500).json({
      success: false,
      message: "Notification not found",
    });
  }
  res.send(notify);
});

// tìm bằng product bằng user_id
router.get(`/user/:userid`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.userid)) {
    return res.status(400).send("Invalid user id");
  }
  const user_id = req.params.userid;

  const notify = await NotificationHot.find({ user_id: user_id })
    .populate(["user_id", "NotifyType_id", "wholiked"])
    .sort({ dateCreated: -1 });

  if (!notify) {
    res.status(500).json({
      success: false,
      message: "Notification not found",
    });
  }
  res.send(notify);
});

/**
 *Them thong bao hot
 */
router.post("/", async (req, res) => {
  let Notify = new NotificationHot({
    title: req.body.title,
    wholiked: req.body.wholiked,
    PeopleLiked: req.body.PeopleLiked,
    title: req.body.title,
    content: req.body.content,
    banner: req.body.banner,
    user_id: req.body.user_id,
    NotifyType_id: req.body.NotifyType_id,
    hot_id: req.body.hot_id,
  });
  Notify = await Notify.save();

  if (!Notify)
    return res.status(400).send("the Notification cannot be created!");
  res.send(Notify);
});

module.exports = router;
