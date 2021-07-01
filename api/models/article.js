const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

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
    authorId: {
        type: String,
        required: true,
      },
})

articleSchema.plugin(uniqueValidator, { message: "Error, expected \"{PATH}\" ({VALUE}) to be unique "});

module.exports = mongoose.model("Article", articleSchema);