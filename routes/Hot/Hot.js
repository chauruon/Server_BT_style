const Hot = require("../../model/Hot/Hot");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

/**
 * Lấy tất cả Hot
 */
router.get("/", async (req, res) => {
  const hots = await Hot.find().populate("user_id").sort({ dateCreated: -1 });

  if (!hots) {
    res.status(500).json({
      success: false,
    });
  }
  res.status(200).send(hots);
});

// tìm bằng hot bằng hot_id
router.get(`/:id`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Hot Id");
  }

  const hots = await Hot.findById(req.params.id).populate("user_id");
  // const product = await Product.findOne({_id:req.params.id}).populate("categories_id");

  console.log("product", hots);

  if (!hots) {
    res.status(500).json({
      success: false,
      message: "Hot not found",
    });
  }
  res.send(hots);
});

/**
 *Them Hot
 */
router.post("/", async (req, res) => {
  let hots = new Hot({
    user_id: req.body.user_id,
    images: req.body.images,
    content: req.body.content,
  });
  hots = await hots.save();

  if (!hots) return res.status(400).send("the hot cannot be created!");
  res.send(hots);
});

/**
 * cập nhật sản phẩm
 * @param {id}
 */
router.put(`/:id`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Hot Id");
  }
  const { user_id, images, content } = req.body;

  const updatedHot = await Hot.findByIdAndUpdate(
    req.params.id,
    {
      user_id,
      images,
      content,
    },
    { new: true }
  );

  if (!updatedHot) {
    return res.status(500).send("the hot cannot be updated!");
  }

  res.send(updatedHot);
});

/**
 * Xóa sản phẩm bằng id
 *@param {id}
 */
router.delete("/:id", (req, res) => {
  Hot.findByIdAndRemove(req.params.id)
    .then((hot) => {
      if (hot) {
        return res.status(200).json({
          success: true,
          message: "the hot is deleted!",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "hot not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
