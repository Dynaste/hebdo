const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const donationSchema = new Schema({
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

donationSchema.plugin(uniqueValidator, { message: "Error, expected \"{PATH}\" ({VALUE}) to be unique "});

module.exports = mongoose.model("Donation", donationSchema);