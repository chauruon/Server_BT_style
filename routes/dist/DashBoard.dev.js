"use strict";

var express = require("express");

var router = express.Router();

var mongoose = require("mongoose");

var DashBoard = require("../model/DashBoard"); //lấy tất cả thông báo


router.get("/", function _callee(req, res) {
  var DashBoardList;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(DashBoard.find());

        case 2:
          DashBoardList = _context.sent;

          if (!DashBoardList) {
            res.status(500).json({
              success: false
            });
          }

          res.status(200).send(DashBoardList);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}); //Thêm một dashboard moi by id the loai

router.post("/", function _callee2(req, res) {
  var dashboard;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          dashboard = new DashBoard({
            title: req.body.title,
            Styles: req.body.Styles,
            theloai_id: req.body.theloai_id
          });
          _context2.next = 3;
          return regeneratorRuntime.awrap(dashboard.save());

        case 3:
          dashboard = _context2.sent;

          if (dashboard) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.status(400).send("The dashboard cannot be created!"));

        case 6:
          res.send(dashboard);

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
}); //Thêm một dashboard moi by id the loai

router.put("/:id", function _callee3(req, res) {
  var dashboard;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          dashboard = new DashBoard({
            title: req.body.title,
            Styles: req.body.Styles,
            theloai_id: req.params.id
          });
          _context3.next = 3;
          return regeneratorRuntime.awrap(dashboard.save());

        case 3:
          dashboard = _context3.sent;

          if (dashboard) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(400).send("The dashboard cannot be created!"));

        case 6:
          res.send(dashboard);

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
});
/**
 * cập nhật styles dashboard
 * @param {id}
 */

router.put("/styles/:id", function _callee4(req, res) {
  var Styles, updatedDashBoard;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (mongoose.isValidObjectId(req.params.id)) {
            _context4.next = 2;
            break;
          }

          return _context4.abrupt("return", res.status(400).send("Invalid Product Id"));

        case 2:
          Styles = req.body.Styles;
          _context4.next = 5;
          return regeneratorRuntime.awrap(DashBoard.findByIdAndUpdate(req.params.id, {
            $push: {
              Styles: Styles
            }
          }, {
            upsert: true
          }));

        case 5:
          updatedDashBoard = _context4.sent;

          if (updatedDashBoard) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(500).send("the product cannot be updated!"));

        case 8:
          res.send(updatedDashBoard);

        case 9:
        case "end":
          return _context4.stop();
      }
    }
  });
});
/**
 * remove dashboard by id dashboard
 *@param {id}
 */

router["delete"]("/:id", function (req, res) {
  DashBoard.findByIdAndRemove(req.params.id).then(function (dashboard) {
    if (dashboard) {
      return res.status(200).json({
        success: true,
        message: "the dashboard is deleted!"
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "dashboard not found!"
      });
    }
  })["catch"](function (err) {
    return res.status(500).json({
      success: false,
      error: err
    });
  });
});
module.exports = router;