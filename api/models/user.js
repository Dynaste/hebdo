const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    role: {
       type: String,
       required: true,
       trim: true
    },
    password: {
        type: String,
        required: 'A password is required',
        trim: true
    },
    email: {
        type: String,
        required: 'An email is required',
        unique: true
    }
})

userSchema.plugin(uniqueValidator, { message: "Error, expected \"{PATH}\" ({VALUE}) to be unique "});

module.exports = mongoose.model("User", userSchema);