const mongoose = require('mongoose');
const validator = require('validator');
const userRoles = require('../utils/userRoles');

const userSchema = new mongoose.Schema({

    firstName: {
        type : String,
        required : true,
    },
    lastName: {
        type : String,
        required : true,
    },
    email: {
        type: String ,
        required: true,
        unique: true,
        validate: [validator.isEmail , 'This Field must be a valid Email address']

    },
    password: {
        type: String ,
        require: true,

    },
    role: {
        type: String,
        enum: [userRoles.ADMIN , userRoles.USER],
        default: userRoles.USER
    },
    token: {
        type: String
    },
    avatar:{
        type:String,
        default: "uploads/profile.png"
    }    



});

module.exports = mongoose.model('User', userSchema);
