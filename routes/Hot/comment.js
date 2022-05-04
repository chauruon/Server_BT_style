const Comment = require("../../model/Hot/comment");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//lay tat ca comment_like
router.get(`/`, async (req, res) => {
  const commentLikeList = await Comment.find().populate(["hot_id", "user_id"]);

  if (!commentLikeList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(commentLikeList);
});

// get all comment by hot_id
router.get(`/hots/:id`, async (req, res) => {
  console.log("hello");

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Comment Id");
  }

  const comments = await Comment.find({ hot_id: req.params.id })
    .populate(["hot_id", "user_id"])
    .sort({ dateCreated: 1 });

  if (!comments) {
    res.status(500).json({
      success: false,
      message: "Comment not found",
    });
  }
  res.send(comments);
});

//thêm comment
router.post(`/`, async (req, res) => {
  const { hot_id, user_id, comment } = req.body;

  let comments = new Comment({
    hot_id,
    user_id,
    comment,
  });

  comments = await comments.save();

  if (!comments) return res.status(500).send("The comment cannot be created");

  res.send(comments);
});

/**
 * cập nhật comment
 * @param {id}
 */
router.put(`/:id`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Comment Id");
  }
  const { hot_id, user_id, comment } = req.body;

  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.id,
    {
      hot_id,
      user_id,
      comment,
    },
    { new: true }
  );

  if (!updatedComment) {
    return res.status(500).send("the comment cannot be updated!");
  }

  res.send(updatedComment);
});

/**
 * Xóa comment bằng id
 *@param {id}
 */
router.delete("/:id", (req, res) => {
  Comment.findByIdAndRemove(req.params.id)
    .then((comment) => {
      if (comment) {
        return res.status(200).json({
          success: true,
          message: "the comment is deleted!",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "comment not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

/**
 * Lấy lượt comment của bài viết đó băng hot_id
 */
router.get(`/numbercomment/:hot_id`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.hot_id)) {
    return res.status(400).send("Invalid Hot Id");
  }

  const comments = await Comment.find({ hot_id: req.params.hot_id });
  const countLike = comments.length;

  if (!comments) {
    res.status(500).json({
      success: false,
    });
  }
  res.send({
    comments: countLike,
  });
});

module.exports = router;
