const Comment_reply = require("../../model/Hot/comment_reply");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//lay tat ca comment_reply
router.get(`/`, async (req, res) => {
  const commentLikeList = await Comment_reply.find().populate([
    "user_id",
    "comment_id",
  ]);

  if (!commentLikeList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(commentLikeList);
});

//thêm comment_Comment_reply
router.post(`/`, async (req, res) => {
  const { user_id, comment_id, comment } = req.body;

  let comments = new Comment_reply({
    user_id,
    comment_id,
    comment,
  });

  comments = await comments.save();

  if (!comments)
    return res.status(500).send(" Comment_reply cannot be created");

  res.send(comments);
});

/**
 * cập nhật comment_Comment_reply
 * @param {id}
 */
router.put(`/:id`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Comment_reply Id");
  }
  const { user_id, comment_id } = req.body;

  const updatedComment_reply = await Comment_reply.findByIdAndUpdate(
    req.params.id,
    {
      user_id,
      comment_id,
    },
    { new: true }
  );

  if (!updatedComment_reply) {
    return res.status(500).send("Comment_reply cannot be updated!");
  }

  res.send(updatedComment_reply);
});

/**
 * Xóa comment_reply bằng id
 *@param {id}
 */
router.delete("/:id", (req, res) => {
  Comment_reply.findByIdAndRemove(req.params.id)
    .then((commentReplies) => {
      if (commentReplies) {
        return res.status(200).json({
          success: true,
          message: "comment replies is deleted!",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "comment replies not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
