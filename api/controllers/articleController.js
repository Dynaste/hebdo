const Article = require('../models/article');

const { port, baseUrl: hostname } = require('./../config');

const {
    get_request_path,
    json_response,
    check_update,
    check_get_one,
    check_create_element
} = require('../utils/utils');

exports.get_all_articles = (req, res) => {
    let statusCode = 200;
    Article.find({})
        //.populate("user")
        .exec((err,articles) => {
            if (err) {
                statusCode = 500;
                throw 'Server internal error.';
            } else {
                const articlesList = [];
                articles.forEach((article) => {
                    const newObjarticle = {
                        _id: article._id,
                        title: article.title,
                        author: article.author,
                        link: `http://${hostname}:${port}/articles/${article._id}`,
                    };
                    articlesList.push({ ...newObjarticle });
                });

                const obj = {
                    ...articlesList,
                    _options: {
                        create: {
                            method: 'POST',
                            link: `http://${hostname}:${port}/articles/create`,
                            properties: {
                                title: 'String',
                                author: 'String',
                            },
                        },
                    },
                };
                json_response(
                    req,
                    res,
                    statusCode,
                    'GET',
                    {type: 'getMany', objName: 'article', value: articlesList.length},
                    obj
                );
            }
        });
    }
exports.get_one_article = (req, res) => {
    let statusCode = 202;
    const articleId = req.params.id;
    try {
        const article = Article.findOne({ _id: articleId });
        if (!article) {
            statusCode = 400;
            return res.send.json({
                statusCode,
                requestMethod: 'GET',
                message: 'Article not found',
            });
        }
        return res.status(statusCode).json({
            statusCode,
            method: 'GET',
            article,
            _options: {
                create: {
                    method: 'POST',
                    link: `http://${baseUrl}/articles/${article._id}/create`,
                },
                update: {
                    method: 'PUT',
                    link: `http://${baseUrl}/articles/${article._id}/update`,
                },
                delete: {
                    method: 'DELETE',
                    link: `http://${baseUrl}/articles/${article._id}/delete`,
                },
            },
        });
    } catch (error) {
        statusCode = 500;
        console.log(error);
        return res
            .status(statusCode)
            .send({ message: 'Internal server error' });
    }
};

exports.create_an_article = (req, res) => {
    let statusCode = 202;
    let new_article = new Article({ ...req.body });
    new_article.save((error, article) => {
        if (error) {
            statusCode = 500;
            return res.status(statusCode).json({
                message: 'Server internal error',
            });
        } else {
            return res.status(201).json({
                message: `Article created: ${article.title}`,
                article: new_article,
                author: 
                statusCode,
                requestMethod: 'POST',
            });
        }
    });
};

exports.update_an_article = (req, res) => {
    let statusCode = 202;
    const id = req.params.articleId;
    const data = req.body;
    try {
        isExistArticle = Article.findById(id);

        if (!isExistArticle) {
            statusCode = 404;
            return res
                .status(statusCode)
                .send({ message: 'Article not found' });
        }

        const article = Article.findOneAndUpdate(
            { _id: id },
            { $set: data },
            { new: true }
        );

        return res.send({
            message: 'Article updated',
            article,
            statusCode,
            requestMethod: 'PUT',
        });
    } catch (error) {
        (statusCode = 500),
            res.status(statusCode).send({ message: 'Internal server error' });
    }
};

exports.delete_an_article = (req, res) => {
    let statusCode = 202;
    const id = req.params.articleId;
    Article.findById(id, (error, docs) => {
        if (error) {
            statusCode = 500;
            return res
                .status(statusCode)
                .json({ message: 'Internal server error' });
        }
        if (!docs) {
            statusCode = 404;
            return res
                .status(statusCode)
                .json({ message: 'Article not found' });
        }
        return res.send.json({
            docs,
            message: 'Article deleted',
            statusCode,
            requestMethod: 'DELETE',
            link: `http://${baseUrl}/article/${article._id}/delete`,
            //link: "http://${baseUrl}/article/${article._id}/delete"
        });
    });
};
