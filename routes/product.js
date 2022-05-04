const Product = require("../model/product");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
var ObjectId = require("mongodb").ObjectId;
var cloudinary = require("../utils/cloudinary");

//thêm sản phẩm
router.post(`/`, async (req, res) => {
  const {
    ten,
    gia,
    kichthuoc,
    mota,
    soluong,
    product,
    ThumbImg,
    categories_id,
  } = req.body;

  let products = new Product({
    ten,
    gia,
    kichthuoc,
    mota,
    ThumbImg,
    soluong,
    product,
    categories_id,
  });

  products = await products.save();

  if (!products) return res.status(500).send("The product cannot be created");

  res.send(products);
});

router.get("/test", async (req, res) => {
  console.log("test");
  for (let index = 0; index < 5; index++) {
    const result = await cloudinary.uploader.upload("", {
      folder: "ArtWear",
      use_filename: true,
    }); //image
    console.log(
      "🚀 ~ file: product.js ~ line 33 ~ router.get ~ result",
      result
    );
  }
});

//lấy tất cả dữ liệu sản phẩm
router.get(`/`, async (req, res) => {
  const productList = await Product.find().populate("categories_id");

  if (!productList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(productList);
});

//tăng lượt xem
router.put(`/increase_views/:product_id`, async (req, res) => {
  console.log("test views", req.params.product_id);

  if (!mongoose.isValidObjectId(req.params.product_id)) {
    return res.status(400).send("Invalid Prouct Id");
  }

  const products = await Product.findByIdAndUpdate(
    req.params.product_id,
    {
      $inc: { viewer: 1 },
    },
    { new: true } //to return the new document
  );
  res.json(products);
});

// tìm bằng product bằng id
router.get(`/:id`, async (req, res) => {
  console.log("hello");

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Prouct Id");
  }

  const product = await Product.findById(req.params.id).populate(
    "categories_id"
  );
  // const product = await Product.findOne({_id:req.params.id}).populate("categories_id");

  console.log("product", product);

  if (!product) {
    res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }
  res.send(product);
});

/**
 * cập nhật sản phẩm
 * @param {id}
 */
router.put(`/:id`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Product Id");
  }
  const {
    ten,
    gia,
    kichthuoc,
    mota,
    ThumbImg,
    soluong,
    product,
    categoies_id,
  } = req.body;

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      ten,
      gia,
      kichthuoc,
      mota,
      ThumbImg,
      soluong,
      product,
      categoies_id,
    },
    { new: true }
  );

  if (!updatedProduct) {
    return res.status(500).send("the product cannot be updated!");
  }

  res.send(updatedProduct);
});

/**
 * Xóa sản phẩm bằng id
 *@param {id}
 */
router.delete("/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res.status(200).json({
          success: true,
          message: "the product is deleted!",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "product not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

//đếm số lượng sản phẩm
router.get(`/get/count`, async (req, res) => {
  const productCount = await Product.countDocuments((count) => count);

  if (!productCount) {
    res.status(500).json({
      success: false,
    });
  }
  res.send({
    productCount: productCount,
  });
});

/**
 * @param {count}
 * lấy giới hạn số lượng sản phẩm
 */
router.get(`/get/product/:count`, async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({}).limit(+count);
  console.log("count", +count);
  if (!products) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(products);
});

module.exports = router;
