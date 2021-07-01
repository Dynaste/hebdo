const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const animalSchema = new Schema({
    type: {
        type: String,
        required: true,
    },
    race: {
       type: String,
       required: true,
       trim: true
    },
    
    name: {
        type: String,
        required: true,
        trim: true
    },

    weight: {
        type: Number,
        required: true,
    },
    age: {
        type: Number,
        required: true
    },
    adoptDate: {
        type: Date,
    },
    adopterId: {
        type: String
    }
})

animalSchema.plugin(uniqueValidator, { message: "Error, expected \"{PATH}\" ({VALUE}) to be unique "});
module.exports = mongoose.model("Animal", animalSchema);
