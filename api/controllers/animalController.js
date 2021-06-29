require('dotenv').config();
const Animal = require('../models/animal');

exports.get_all_animals = (req, res) => {
    res.send("All")
}

exports.get_one_animal = (req, res) => {
    res.send("One")
}