const Category = require("../model/category");
const express = require("express");
const router = express.Router();

//lấy tất cả thể loại
router.get("/", async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({
      success: false,
    });
  }
  res.status(200).send(categoryList);
});

//Thêm một thể loại mới
router.post("/", async (req, res) => {
  let category = new Category({
    name: req.body.name,
    image: req.body.image,
    color: req.body.color,
  });
  category = await category.save();

  if (!category) return res.status(400).send("the category cannot be created!");

  res.send(category);
});

//cập nhật dữ liệu thể loại
router.put("/:id", async (req, res) => {
  console.log("body", req.body);
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      image: req.body.image,
      color: req.body.color,
    },
    {
      new: true,
    }
  );

  if (!category) return res.status(400).send("the category cannot be created!");

  res.send(category);
});

router.delete("/:id", (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res.status(200).json({
          success: true,
          message: "the category is deleted!",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "category not found!",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        error: err,
      });
    });
});

module.exports = router;
