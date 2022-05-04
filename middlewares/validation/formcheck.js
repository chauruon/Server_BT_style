const {check, validationResult}= require('express-validator');

// Validator check lỗi form đăng ký
exports.validateUserSignUp =[
    check('fullname')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Name is required!')
    .isString()
    .withMessage('Must be a valid name!')
    .isLength({min:3, max:20})
    .withMessage('Name must be within 3 to 20 character !'),
    
    check('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid Email!'),

    check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password is empty!')
    .isLength({min:8, max:20})
    .withMessage('Password must be within 8 to 20 character !'),
     
    check('confirmPassword').trim().not().isEmpty().custom((value,{req})=>{
        if(value !== req.body.password){
            throw new Error('Both Password must be same!')
        }
        return true;
    })
    
]

exports.userVlidation= (req,res,next)=>{
    const result = validationResult(req).array();
    if(!result.length)
    return next();
    const error= result[0].msg;
    res.json({success:false, message:error});
}

// Validator check lỗi form đăng nhập
exports.validateUserSignIn =[
    check('email')
    .trim()
    .isEmail()
    .withMessage('email/ password is required abc!'),

    check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('email/ password is required ddd!'),
]

// Validator check form reset new pass word
exports.validateUserReset =[    
    check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password is empty!')
    .isLength({min:8, max:20})
    .withMessage('Password must be within 8 to 20 character !'),
     
    check('confirmPassword').trim().not().isEmpty().custom((value,{req})=>{
        if(value !== req.body.password){
            throw new Error('Both Password must be same!')
        }
        return true;
    })
    
]