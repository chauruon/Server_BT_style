var express = require('express');
var router = express.Router();
const User = require('../model/userModel');
const bcrypt = require('bcryptjs')
// Import file tu controller
const {
  createUser,
  userSignIn,
  signOut,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
// Import file check loi dang ki, dang nhap
const {
  validateUserSignUp,
  userVlidation,
  validateUserSignIn,
  validateUserReset
} = require('../middlewares/validation/formcheck');
const { isAuth } = require('../middlewares/auth');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// POST create-user
router.post('/create-user', validateUserSignUp, userVlidation, createUser);

// POST sign-in
router.post('/sign-in', validateUserSignIn, userVlidation, userSignIn);

//create-post
router.post('/create-post', isAuth, (req, res) => {
  //Create our post 
  res.send("Welcome you are in  secret route");
})

//Sign-out
router.get('/sign-out', isAuth, signOut);

//profile
router.get('/profile', isAuth, (req, res) => {
  if (!req.user)
    return res.json({ success: false, message: 'unauthorized access!' });
  res.json({
    success: true,
    profile: {
      _id: req.user._id,
      fullname: req.user.fullname,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
      phone: req.user.phone,
      sex: req.user.sex,
      address: req.user.address,
      birthday: req.user.birthday,
    },
  });
});
//Delete User
router.post('/delete', (req, res) => {
  User.findByIdAndRemove(req.body.id)
    .then(data => {
      console.log(data)
      res.send(data)
    }).catch(err => {
      console.log("error", err)
    })
})
//Update User
router.post('/update', (req, res) => {
  User.findByIdAndUpdate(req.body.id, {
    fullname: req.body.fullname,
    email: req.body.email,
    avatar: req.body.avatar,
    phone: req.body.phone,
    sex: req.body.sex,
    address: req.body.address,
    birthday: req.body.birthday,
  }).then(data => {
    console.log(data)
    res.send(data)
    // res.send("Update")
  }).catch(err => {
    console.log("error", err)
  })
})

//Get User List
router.get(`/UserAll`, async (req, res) => {
  const userList = await User.find().select("-passwordHash");
  if (!userList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(userList);
});

//User find by id
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");
  if (!user) {
    res.status(500).json({
      message: "The user with the given ID was not found.",
    });
  }
  res.status(200).send(user);
});

//forgot-Password (send link email)
router.put('/forgot-Password', forgotPassword);

//resetPassword (doi mat khau)
router.put('/new-Password', resetPassword);


router.put("/update/:id", async (req, res) => {
  console.log("body", req.body);
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      fullname: req.body.fullname,
      email: req.body.email,
      avatar: req.body.avatar,
      phone: req.body.phone,
      sex: req.body.sex,
      address: req.body.address,
      birthday: req.body.birthday,
    },
    {
      new: true,
    }
  );

  if (!user) return res.status(400).send("the user cannot be created!");

  res.send(user);
});


/**
 * Xóa User bằng id
 *@param {id}
 */
router.delete("/deleteUser/:id", async (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((userlist) => {
      if (userlist) {
        return res.status(200).json({
          success: true,
          message: "the user is deleted!",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "user not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;

