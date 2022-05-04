const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Voucher = require("../model/Voucher");
const generatedCode = require("../helper/randomCode");

//get all
router.get("/", async (req, res) => {
  const vouchers = await Voucher.find().populate("User_id");
  if (!vouchers) {
    res.status(500).json({
      success: false,
    });
  }
  res.status(200).send(vouchers);
});

//insert voucher
router.post("/:User_id", async (req, res) => {
  let voucher = new Voucher({
    User_id: req.body.User_id,
    code: generatedCode(7),
    ten: req.body.ten,
    title: req.body.title,
    image: req.body.image,
    gioihan: req.body.gioihan,
    sotiengiam: req.body.sotiengiam,
    sudung: req.body.sudung,
    dateStart: req.body.dateStart,
    dateEnd: req.body.dateEnd,
  });
  voucher = await voucher.save();

  if (!voucher) return res.status(400).send("the voucher cannot be created!");

  res.send(voucher);
});

//Voucher by id
router.get("/:id", async (req, res) => {
  const vouchers = await Voucher.findById(req.params.id);
  if (!vouchers) {
    res.status(500).json({
      success: false,
    });
  }
  res.status(200).send(vouchers);
});


/**
 * cập nhật Voucher
 * @param {id}
 */
 router.put(`/:id`, async (req, res) => {
  const { sudung } = req.body;

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Voucher Id");
  }

  const updatedVoucher = await Voucher.findByIdAndUpdate(
    req.params.id,
    {
      sudung,
    },
    { new: true }
  );

  if (!updatedVoucher) {
    return res.status(500).send("the voucher cannot be updated!");
  }

  res.send(updatedVoucher);
});

module.exports = router;
