const Like = require("../../model/Hot/like");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

/**
 * Lấy tất cả Like
 */
router.get("/", async (req, res) => {
  const likes = await Like.find()
    .populate(["hot_id", "user_id"])
    .sort({ dateCreated: 1 });

  if (!likes) {
    res.status(500).json({
      success: false,
    });
  }
  res.status(200).send(likes);
});

// tìm bằng like bằng like_id
router.get(`/:id`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Like Id");
  }

  const likes = await Like.findById(req.params.id).populate([
    "hot_id",
    "user_id",
  ]);
  // const product = await Product.findOne({_id:req.params.id}).populate("categories_id");

  console.log("product", likes);

  if (!likes) {
    res.status(500).json({
      success: false,
      message: "Like not found",
    });
  }
  res.send(likes);
});

// tìm bằng like bằng userid and hotid
router.get(`/hot/user`, async (req, res) => {
  const { user_id, hot_id } = req.query;
  console.log("hello");
  const likes = await Like.find({
    user_id,
    hot_id,
  }).populate(["hot_id", "user_id"]);
  // const product = await Product.findOne({_id:req.params.id}).populate("categories_id");

  if (!likes) {
    res.status(500).json({
      success: false,
      message: "Like not found",
    });
  }
  res.send(likes);
});

// tìm bằng like bằng hot_id
router.get(`/hot/:id`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid hot Id");
  }

  const likes = await Like.find({ hot_id: req.params.id }).populate([
    "hot_id",
    "user_id",
  ]);
  // const product = await Product.findOne({_id:req.params.id}).populate("categories_id");

  console.log("product", likes);

  if (!likes) {
    res.status(500).json({
      success: false,
      message: "Like not found",
    });
  }
  res.send(likes);
});

// tìm bằng like bằng userid
router.get(`/user/:userid`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.userid)) {
    return res.status(400).send("Invalid user id");
  }

  const likes = await Like.find({ user_id: req.params.userid });

  if (!likes) {
    res.status(500).json({
      success: false,
      message: "Like not found",
    });
  }
  res.send(likes);
});

/**
 * Lấy lượt lại của bài viết đó băng hot_id
 */
router.get(`/numberlike/:hot_id`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.hot_id)) {
    return res.status(400).send("Invalid Hot Id");
  }

  const likes = await Like.find({ hot_id: req.params.hot_id });
  const countLike = likes.length;
  console.log(
    "🚀 ~ file: like.js ~ line 114 ~ router.get ~ countLike",
    countLike
  );

  //   const productCount = await Product.countDocuments((count) => count);

  if (!likes) {
    res.status(500).json({
      success: false,
    });
  }
  res.send({
    likes: countLike,
  });
});

/**
 *Them Like
 *còn thiếu cái xử lý ảnh cloudiary
 */
router.post("/", async (req, res) => {
  let likes = new Like({
    user_id: req.body.user_id,
    hot_id: req.body.hot_id,
    dateCreated: Date.now(),
  });
  likes = await likes.save();

  if (!likes) return res.status(400).send("Like cannot be created!");
  res.send(likes);
});

/**
 * cập nhật like
 * @param {id}
 */
router.put(`/:id`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Like Id");
  }
  const { user_id, hot_id } = req.body;

  const updatedLike = await Like.findByIdAndUpdate(
    req.params.id,
    {
      user_id,
      hot_id,
    },
    { new: true }
  );

  if (!updatedLike) {
    return res.status(500).send("Like cannot be updated!");
  }

  res.send(updatedLike);
});

/**
 * Xóa like by like_id
 *@param {id}
 */
router.delete("/:id", (req, res) => {
  Like.findByIdAndRemove(req.params.id)
    .then((like) => {
      if (like) {
        return res.status(200).json({
          success: true,
          message: "Like is deleted!",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "like not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

/**
 * Xóa like by hot_id
 *@param {id}
 */
router.delete("/", (req, res) => {
  const { user_id, hot_id } = req.query;

  Like.deleteOne({ hot_id, user_id })
    .then((like) => {
      console.log("🚀 ~ file: like.js ~ line 116 ~ .then ~ like", like);
      if (like) {
        if (like.deletedCount == 0) {
          return res.status(200).json({
            success: false,
            message: "hot_id và like_id không tìm thấy hoặc không đúng",
          });
        }
        return res.status(200).json({
          success: true,
          message: "Like is deleted!",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "like not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
