const Favorite = require("../model/Favorite");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

/**
 * get all  favorite
 */
router.get("/", async (req, res) => {
  const favorites = await Favorite.find().populate(["product_id", "user_id"]);

  if (!favorites) {
    res.status(500).json({
      success: false,
    });
  }
  res.status(200).send(favorites);
});

// tìm favorite bang id user
router.get(`/user/:userid`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.userid)) {
    return res.status(400).send("Invalid favorite Id");
  }

  const favorites = await Favorite.find({
    user_id: req.params.userid,
  }).populate(["product_id", "user_id"]);
  // const product = await Product.findOne({_id:req.params.id}).populate("categories_id");

  if (!favorites) {
    res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }
  res.send(favorites);
});

// search favorite by id
router.get(`/:id`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Prouct Id");
  }

  const favorites = await Favorite.findById(req.params.id).populate([
    "product_id",
    "user_id",
  ]);
  // const product = await Product.findOne({_id:req.params.id}).populate("categories_id");

  if (!favorites) {
    res.status(500).json({
      success: false,
      message: "Favorite not found",
    });
  }
  res.send(favorites);
});

//insert favorite
router.post(`/`, async (req, res) => {
  const { product_id, user_id, isFavorite } = req.body;

  let favorites = new Favorite({
    product_id,
    user_id,
    isFavorite,
  });

  favorites = await favorites.save();

  if (!favorites) return res.status(500).send("The favorite cannot be created");

  res.send(favorites);
});

/**
 * remove favorite
 *@param {id}
 */
router.delete("/:id", (req, res) => {
  Favorite.findByIdAndRemove(req.params.id)
    .then((favorite) => {
      if (favorite) {
        return res.status(200).json({
          success: true,
          message: "the favorite is deleted!",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "favorite not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

/**
 * remove favorite
 *@param {id}
 */
router.delete("/product/:product_id", (req, res) => {
  Favorite.deleteOne({ product_id: req.params.product_id })
    .then((favorite) => {
      if (favorite) {
        return res.status(200).json({
          success: true,
          message: "the favorite is deleted!",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "favorite not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });

    
});

module.exports = router;
