const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const donSchema = new Schema({
    date: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
       type: String,
       required: false,
       trim: true
    },
})

donSchema.plugin(uniqueValidator, { message: "Error, expected \"{PATH}\" ({VALUE}) to be unique "});

module.exports = mongoose.model("Don", donSchema);