const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const User = require('../models/user');

const articleSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    subtitle: {
       type: String,
       required: false,
       trim: true
    },
    content: {
       type: String,
       required: true,
       trim: true
    },
    author: {
        type: User,
        required: true,
        trim: true
    }
})

articleSchema.plugin(uniqueValidator, { message: "Error, expected \"{PATH}\" ({VALUE}) to be unique "});

module.exports = mongoose.model("Article", articleSchema);