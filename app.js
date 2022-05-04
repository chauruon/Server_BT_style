var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
require("dotenv/config");

//env
const api = process.env.API_URL;

//routes
// var indexRouter = require("./routes/index");
var productRouter = require("./routes/product");
var categoriesRouter = require("./routes/categories");
var CartRouter = require("./routes/Cart");
var ReviewsRouter = require("./routes/Review");
var OrdersRouter = require("./routes/Orders");
var DashboardRouter = require("./routes/DashBoard");
var FavoriteRouter = require("./routes/Favorite");
var VoucherRouter = require("./routes/Voucher");
var HotRouter = require("./routes/Hot/Hot");
var LikeRouter = require("./routes/Hot/like");
var CommentRouter = require("./routes/Hot/comment");
var CommentLikeRouter = require("./routes/Hot/comment_like");
var CommentReplyRouter = require("./routes/Hot/comment_reply");
var NotityTypeRouter = require("./routes/Notification/NotityType");
var NotificationHotRouter = require("./routes/Notification/TypeNotification/Notification_Hot");

var conversationRoute = require("./routes/conversations");
var messageRoute = require("./routes/messages");

var usersRoutes = require("./routes/User");

//database
var Mongodb = require("./database/connectMongo");

const { json } = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");

var app = express();

//helpers
const authJwt = require("./helper/jwt");
const errorHandler = require("./helper/error-handler");
const server = require("http").createServer();
const io = require("socket.io")(server);

// io.on("connection", () => {
//   console.log("test socket");
// });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use(userRouter);

//dùng để chặn localhost khi chưa đăng nhập
// app.use(authJwt());
// app.use(errorHandler);

//Router
//view api
// http://localhost:3000/api/v1/products

app.use(`${api}/products`, productRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/carts`, CartRouter);
app.use(`${api}/reviews`, ReviewsRouter);
app.use(`${api}/orders`, OrdersRouter);
app.use(`${api}/dashboard`, DashboardRouter);
app.use(`${api}/favorite`, FavoriteRouter);
app.use(`${api}/voucher`, VoucherRouter);

//hots
app.use(`${api}/hot`, HotRouter);
app.use(`${api}/like`, LikeRouter);

//comment
app.use(`${api}/comment`, CommentRouter);
app.use(`${api}/comment_like`, CommentLikeRouter);
app.use(`${api}/comment_reply`, CommentReplyRouter);

app.use(`${api}/users`, usersRoutes);

//hots
app.use(`${api}/conversation`, conversationRoute);
app.use(`${api}/message`, messageRoute);

app.use(`${api}/notification_hot`, NotificationHotRouter);
app.use(`${api}/notificationtype`, NotityTypeRouter);

// app.use(`${api}/orders`, orderRoutes);

//other
// app.use("/", indexRouter);

//connect database
Mongodb();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// setInterval(() => {
//   console.log("test");
// }, 3000);
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
