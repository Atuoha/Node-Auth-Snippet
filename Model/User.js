const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    fullname: {
        type: String,
        required: true,
        minLength: 5,
        trim: true
    },

    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
    },

    password:{
        type: String,
        required: true,
        trim: true
    },

    role:{
        type: Number,
        default: 0,
        trim: true
    },

    isActive:{
        type: Number,
        default: 0,
        trim: true
    }

})

module.exports = mongoose.model('users', UserSchema)