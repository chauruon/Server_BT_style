const Order = require("../model/Order");

const OrderItem = require("../model/OrderItems");
const Status = require("../constraint/OrderSatus");
const {
  removeDuplicatesByDate,
  removePropertiesFromArray,
  removeObjectIdByObject,
} = require("../utils/Method");
const {
  AggregateSalesOfDay,
  AggregateSalesOfDayByStatus,
} = require("../helper/Aggregate/AggregateSalesOfDay");

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

var ObjectId = require("mongoose").Types.ObjectId;
/**
 * Lấy tất cả Order va orderitem
 */
router.get("/", async (req, res) => {
  // .populate({
  //   path: "orderItems",
  //   populate: {
  //     path: "product",
  //     populate: "categories_id",
  //   },
  // })
  const OrderList = await Order.find()
    .populate(["user_id"])
    .populate({
      path: "orderitems",
      populate: {
        path: "product",
      },
    })
    .sort({
      dateOrdered: -1,
    });

  if (!OrderList) {
    res.status(500).json({
      success: false,
    });
  }
  res.status(200).send(OrderList);
});

/**
 * Lấy tổng số lượng của 1 sản phẩm
 * @param {id}
 */
router.get("/product-sold/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Id");
  }

  const OrderList = await Order.find({})
    .populate("user_id", "fullname")
    .populate("orderitems");
  let total = 0;

  OrderList.forEach((order) => {
    if (order.status == 1) {
      console.log("order", order);
      order.orderitems.forEach((orderitem) => {
        if (orderitem.product == req.params.id) {
          total += orderitem.quantity;
        }
      });
      // total += orderitem.quantity;
    }
  });
  console.log("total", total);
  if (!OrderList) {
    res.status(500).json({
      success: false,
      message: "Orders not found",
    });
  }

  res.status(200).send({ total_Product: total });
});

/**
 *tìm sản phẩm người dùng đã đặt
 *@params{userid}
 */
router.get(`/get/userorders/:userid`, async (req, res) => {
  const userOrderList = await Order.find({ user_id: req.params.userid })
    .populate("user", "name")
    .populate({
      path: "orderitems",
      populate: {
        path: "product",
        populate: "categories_id",
      },
    });

  if (!userOrderList) {
    res.status(500).json({ success: false });
  }
  res.send(userOrderList);
});

/**
 *Đếm số lượng tất cả order
 */
router.get(`/get/count`, async (req, res) => {
  const orderCount = await Order.countDocuments((count) => count);

  if (!orderCount) {
    res.status(500).json({
      success: false,
    });
  }
  res.send({
    orderCount: orderCount,
  });
});

/**
 * Lấy tất cả Order bằng id
 */
router.get(`/:id`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Orders Id");
  }
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderitems",
      populate: {
        path: "product",
        populate: "categories_id",
      },
    });

  if (!order) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(order);
});
/**
 * Thêm orders
 */
router.post(`/`, async (req, res) => {
  //lay id orderitem
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      //thêm orderitem
      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );
  const orderItemsIdsResolved = await orderItemsIds;
  console.log(
    "file: Orders.js Log: line 38 Log: router.post Log: orderItemsIdsResolved",
    orderItemsIdsResolved
  );

  //Tính tổng giá số lượng sản phẩm
  const totalPrices = Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate([
        "orderitems",
        "product",
      ]);
      console.log(
        "file: Orders.js Log: line 44 Log: orderItemsIdsResolved.map Log: orderItem",
        orderItem
      );

      const totalPrice = orderItem.product.gia * orderItem.quantity;
      return totalPrice;
    })
  );

  //tính tổng giá tất cả
  const totalPrice = (await totalPrices).reduce((a, b) => a + b, 0);

  let orders = new Order({
    note: req.body.note,
    Payment: req.body.Payment,
    orderitems: orderItemsIdsResolved,
    imageSp: req.body.imageSp,
    size: req.body.size,
    color: req.body.color,
    country: req.body.country,
    city: req.body.city,
    status: req.body.status,
    fullname: req.body.fullname,
    phone: req.body.phone,
    priceVoucher: req.body.priceVoucher,
    totalPrice: totalPrice,
    totalFinalPrice: req.body.totalFinalPrice,
    lydohuy: req.body.lydohuy,
    user_id: req.body.user_id,
  });

  orders = await orders.save();

  if (!orders) return res.status(500).send("The order cannot be created");

  res.send(orders);
});

/**
 * update tiến trình khi đặt hàng status 1->5... tùy thuộc vào nhiều bước
 * @params {id} of Orders
 */
router.put("/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );

  if (!order) return res.status(400).send("the order cannot be created!");

  res.send(order);
});

/**
 * update trạng thái huỷ (5) và lý do
 * @params {id} of Orders
 */
router.put("/cancel/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
      lydohuy: req.body.lydohuy,
    },
    {
      new: true,
    }
  );

  if (!order) return res.status(400).send("the order cannot be created!");

  res.send(order);
});

/**
 * Tổng tiền của tất cả order
 */
router.get("/get/totalsales", async (req, res) => {
  const totalSales = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalsales: {
          sum: "$totalPrice",
        },
      },
    },
  ]);

  if (!totalSales) {
    return res.status(400).send("The order sales cannot be generated");
  }

  res.send({
    totalsales: totalSales.pop().totalsales,
  });
});
router.get("/get/statistics_everyday", async (req, res) => {
  const orders = await Order.find({})
    .select("dateOrdered")
    .sort({ dateOrdered: 1 });

  const orderToJson = JSON.stringify(orders);

  const orderAfterRemoveId = removePropertiesFromArray(orderToJson);
  const fullDates = removeDuplicatesByDate(orderAfterRemoveId);
  console.log(
    "🚀 ~ file: Orders.js ~ line 281 ~ router.get ~ fullDates",
    fullDates
  );
  // console.log(
  //   "🚀 ~ file: Orders.js ~ line 281 ~ router.get ~ fullDates",
  //   fullDates
  // );

  let resultToTal = [];
  for (var i in fullDates) {
    const day = fullDates[i];
    console.log("🚀 ~ file: Orders.js ~ line 293 ~ router.get ~ day", day);
    const totalSalesOfDay = await AggregateSalesOfDay({
      day: new Date(day),
      model: Order,
    }); //type Object

    const totalAfterRemoveId = removeObjectIdByObject(totalSalesOfDay);
    console.log(
      "🚀 ~ file: Orders.js ~ line 306 ~ router.get ~ totalAfterRemoveId",
      totalAfterRemoveId
    );

    resultToTal.push({
      date: day,
      total: totalSalesOfDay,
    }); // type Object
  }

  if (!resultToTal) {
    return res.status(400).send("The order sales cannot be generated");
  }

  res.send({
    resultToTal,
  });
});

router.get("/get/statistic_status", async (req, res) => {
  const orders = await Order.find({})
    .select("dateOrdered")
    .sort({ dateOrdered: 1 });

  const orderToJson = JSON.stringify(orders);

  const orderAfterRemoveId = removePropertiesFromArray(orderToJson);
  const fullDates = removeDuplicatesByDate(orderAfterRemoveId);
  console.log(
    "🚀 ~ file: Orders.js ~ line 281 ~ router.get ~ fullDates",
    fullDates
  );
  // console.log(
  //   "🚀 ~ file: Orders.js ~ line 281 ~ router.get ~ fullDates",
  //   fullDates
  // );

  let resultToTal = [];
  for (var i in fullDates) {
    const day = fullDates[i];
    console.log("🚀 ~ file: Orders.js ~ line 293 ~ router.get ~ day", day);
    const totalOrderProcessing = await AggregateSalesOfDayByStatus({
      day: new Date(day),
      model: Order,
      status: Status.ORDERPROCESSING,
    }); //type Object
    console.log(
      "🚀 ~ file: Orders.js ~ line 349 ~ router.get ~ totalOrderProcessing",
      totalOrderProcessing
    );
    const totalWaitForPay = await AggregateSalesOfDayByStatus({
      day: new Date(day),
      model: Order,
      status: Status.WAITFORPAY,
    }); //type Object
    const totalShipping = await AggregateSalesOfDayByStatus({
      day: new Date(day),
      model: Order,
      status: Status.SHIPPING,
    }); //type Object
    const totalDeLivered = await AggregateSalesOfDayByStatus({
      day: new Date(day),
      model: Order,
      status: Status.DELIVERED,
    }); //type Object

    //total after remove id
    const resultProcessing = removeObjectIdByObject(totalOrderProcessing);
    console.log(
      "🚀 ~ file: Orders.js ~ line 371 ~ router.get ~ resultProcessing",
      resultProcessing
    );
    const resultWaitForPay = removeObjectIdByObject(totalWaitForPay);
    const resultShipping = removeObjectIdByObject(totalShipping);
    const resultDeLivered = removeObjectIdByObject(totalDeLivered);

    resultToTal.push({
      date: day,
      processing: {
        name: "xử lý đơn hàng",
        total: resultProcessing,
      },
      waitforpay: {
        name: "đang chờ thanh toán",
        total: resultWaitForPay,
      },
      shipping: {
        name: "đang chờ giao hàng",
        total: resultShipping,
      },
      delivered: {
        name: "Đã giao hàng",
        total: resultDeLivered,
      },
    }); // type Object
  }

  if (!resultToTal) {
    return res.status(400).send("The order sales cannot be generated");
  }

  res.send({
    resultToTal,
  });
});

/**
 * Xóa Order bằng id
 * @params {id} of Orders
 */
router.delete("/:id", (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then((order) => {
      if (order) {
        return res.status(200).json({
          success: true,
          message: "the order is deleted!",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "order not found!",
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
