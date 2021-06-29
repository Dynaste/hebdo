const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
       type: String,
       required: true,
       trim: true
    },
    role: {
       type: String,
       required: true,
       trim: true
    },
    age: {
        type: Number,
        required: true
    }
})

userSchema.plugin(uniqueValidator, { message: "Error, expected \"{PATH}\" ({VALUE}) to be unique "});

module.exports = mongoose.model("User", userSchema);