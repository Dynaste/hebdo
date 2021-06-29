const Article = require('../models/article');

exports.get_all_articles = (req, res) => {
    res.send("All")
}

exports.get_one_articles = (req, res) => {
    res.send("One")
}

// exports.