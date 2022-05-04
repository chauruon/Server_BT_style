const Comment_like = require("../../model/Hot/comment_like");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//lay tat ca comment_like
router.get(`/`, async (req, res) => {
  const commentLikeList = await Comment_like.find().populate([
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

//thêm comment_like
router.post(`/`, async (req, res) => {
  const { user_id, comment_id } = req.body;

  let comments = new Comment_like({
    user_id,
    comment_id,
  });

  comments = await comments.save();

  if (!comments) return res.status(500).send(" comment_like cannot be created");

  res.send(comments);
});

/**
 * cập nhật comment_like
 * @param {id}
 */
router.put(`/:id`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Comment_like Id");
  }
  const { user_id, comment_id } = req.body;

  const updatedComment_like = await Comment_like.findByIdAndUpdate(
    req.params.id,
    {
      user_id,
      comment_id,
    },
    { new: true }
  );

  if (!updatedComment_like) {
    return res.status(500).send("comment_like cannot be updated!");
  }

  res.send(updatedComment_like);
});

/**
 * Xóa comment bằng id
 *@param {id}
 */
router.delete("/:id", (req, res) => {
  Comment_like.findByIdAndRemove(req.params.id)
    .then((comment_like) => {
      if (comment_like) {
        return res.status(200).json({
          success: true,
          message: "comment_like is deleted!",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "comment_like not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
