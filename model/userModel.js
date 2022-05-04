const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,

    },
    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        default: 'user',
    },

    avatar: {
        type: String,
        default: '',
    },

    // tokens:[{type: Object}],

    phone: {
        type: String,
    },
    sex: {
        type: String,
    },
    address: {
        type: String,
    },
    birthday: {
        type: String,
    },

    resetPasswordLink: {
        data: String,
        default: '',
    }

});

// So sánh password
userSchema.methods.comparePassword = async function (password) {
    if (!password) throw new Error('Password is mission, can not compare!');
    try {
        const result = await bcrypt.compare(password, this.password);
        return result;

    } catch (error) {
        console.log('Error while comparing password!', error.message);

    }
}

//Toi muon email phai la duy nhat trong database(Khong duoc trung email)
userSchema.statics.isThisEmailInUse = async function (email) {
    //Check email
    if (!email) throw new Error('Invalid Email');
    try {
        //tim mot nguoi dung(Neu email da duoc su dung, da ton tai thi tra ve false)
        const user = await this.findOne({ email })
        if (user)
            return false;
        //Nguoc lai tra ve true
        return true;
    } catch (error) {
        console.log('error inside isThisEmailInUse method', error, message);
        return false;
    }
}


module.exports = mongoose.model('User', userSchema)



