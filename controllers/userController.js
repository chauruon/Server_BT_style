const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const User = require("../model/userModel");
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    requireTLS: true,
    auth: {
        user: 'abc@gmail.com', // generated ethereal user
        pass: 'abc', // generated ethereal password
    },
});

//Đăng ký
exports.createUser = async (req, res) => {
    const { fullname, email, password } = req.body;
    // Gan email vao ham isThisEmailInUse de kiem tra email ton tai, hoac khong ton tai
    const isNewUser = await User.isThisEmailInUse(email)
    //Check email da ton tai chua? Neu co roi thi false
    if (!isNewUser)
        return res.json({
            success: false,
            message: 'Email này đã được sử dụng, hãy thử đăng nhập',
        });

    const user = await User({
        fullname,
        email,
        password: bcrypt.hashSync(req.body.password, 8),
    });
    await user.save()
        .then(user => {
            transporter.sendMail({
                to: user.email,
                from: "thangly2k1@gmail.com",
                subject: "Đăng ký thành công",
                html: "<h1>Chào mừng bạn đến với Art Wear</h1>"
            })
            res.json({ success: true, user });
        })
        .catch(err => {
            console.log(err)
        })
};

//Đăng nhập 
exports.userSignIn = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user)
        return res.json({
            success: false,
            message: 'Không tìm thấy người dùng, với email đã cho'
        })

    const isMatch = await user.comparePassword(password)
    if (!isMatch)
        return res.json({
            success: false,
            message: 'Email / Mật khẩu không khớp!'
        });

    //Token
    const token = jwt.sign({
        userId: user._id
    },
        process.env.secret,
        {
            expiresIn: '1d',

        });

    // let oldTokens = user.tokens || []

    // if (oldTokens.lenght) {
    //     oldTokens = oldTokens.filter(t => {
    //         //parseInt chuyen ve số nguyên
    //         //chia giá trị cho 1000 sẽ ra giá trị tính bằng giây
    //         const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000
    //         if (timeDiff < 86400) {
    //             //Tra ve
    //             return t
    //         }
    //     })
    // }

    // await User.findByIdAndUpdate(user._id, { tokens: [...oldTokens, { token, signedAt: Date.now().toString() }] })

    const userInfo = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        avatar: user.avatar ? user.avatar : '',
        phone: user.phone,
        sex: user.sex,
        address: user.address,
        birthday: user.birthday
    }

    res.json({
        success: true,
        user: userInfo,
        token,
    })
    console.log(token)

}
//SignOut token
exports.signOut = async (req, res) => {
    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).json({ success: false, message: 'Authorization Fail' });

        }
        //    const tokens=req.user.tokens;
        //    const newTokens = tokens.filter(t=>t.token!==token)
        //    await User.findByIdAndUpdate(req.user._id,{tokens:newTokens})
        await User.findByIdAndUpdate(req.user._id)
        res.json({ success: true, message: 'Sign out successfully!' })
    }
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user)
        return res.json({
            success: false,
            message: 'Không tìm thấy người dùng, với email đã cho'
        })

    const token = jwt.sign({
        userId: user._id
    },
        process.env.secret,
        {
            expiresIn: '1d',

        });

    await user.updateOne({resetPasswordLink:token})   

    //else find user, send link reset pass to email 
    transporter.sendMail({
        to: user.email,
        from: "thangly2k1@gmail.com",
        subject: "Đổi mật khẩu",
        html: `
            <p>Bạn đã yêu cầu đặt lại mật khẩu</p>
            <h5>Bấm vào đây <a href="http://localhost:3001/api/v1/users/resetPassword/${token}">link</a> để đặt lại mật khẩu</h5>
            `
    })
    res.json({ message: "check your email" })
}

exports.resetPassword = async (req, res) => {
    const {token, password} = req.body
    const user = await User.findOne({ resetPasswordLink: token })
    console.log(user)
    if(user){
        const hashPassword = await bcrypt.hash(password,8)
        user.password= hashPassword
        await user.save()
        return res.json({
            success: true,
            message: 'hahaha',
        });
    }
}