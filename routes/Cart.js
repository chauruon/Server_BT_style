const Cart = require("../model/Cart");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

/**
 * Lấy tất cả Cart
 */
router.get("/", async (req, res) => {
  const cartList = await Cart.find().populate(["user_id", "product_id"]);

  if (!cartList) {
    res.status(500).json({
      success: false,
    });
  }
  res.status(200).send(cartList);
});

// tìm cart bang id user
router.get(`/user/:userid`, async (req, res) => {
  console.log("hello");

  if (!mongoose.isValidObjectId(req.params.userid)) {
    return res.status(400).send("Invalid Cart Id");
  }

  const carts = await Cart.find({ user_id: req.params.userid }).populate([
    "product_id",
    "user_id",
  ]);
  // const product = await Product.findOne({_id:req.params.id}).populate("categories_id");

  if (!carts) {
    res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }
  res.send(carts);
});

/**
 *Them cart
 */
router.post("/", async (req, res) => {
  let cart = new Cart({
    amount: req.body.amount,
    product_id: req.body.product_id,
    user_id: req.body.user_id,
    imageSp: req.body.imageSp,
    size: req.body.size,
    color: req.body.color,
  });
  cart = await cart.save();

  if (!cart) return res.status(400).send("the cart cannot be created!");
  res.send(cart);
});

/**
 * Xóa Cart bằng id
 *@param {id}
 */
router.delete("/:id", (req, res) => {
  Cart.findByIdAndRemove(req.params.id)
    .then((cart) => {
      if (cart) {
        return res.status(200).json({
          success: true,
          message: "the cart is deleted!",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "cart not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

/**
 * cập nhật Cart
 * @param {id}
 */
router.put(`/:id`, async (req, res) => {
  const { amount } = req.body;

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Cart Id");
  }

  const updatedCart = await Cart.findByIdAndUpdate(
    req.params.id,
    {
      amount,
    },
    { new: true }
  );

  if (!updatedCart) {
    return res.status(500).send("the product cannot be updated!");
  }

  res.send(updatedCart);
});


/**
 * cập nhật,image ,size, mau sac san pham
 * @param {id}
 */
 router.put(`/updateItem/:id`, async (req, res) => {
  const { imageSp, size, color } = req.body;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Cart Id");
  }
  const updatedCart = await Cart.findByIdAndUpdate(
    req.params.id,
    {
      imageSp,
      size,
      color,
    },
    { new: true }
  );
  if (!updatedCart) {
    return res.status(500).send("the product cannot be updated!");
  }

  res.send(updatedCart);
});

module.exports = router;
