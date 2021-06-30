const Article = require('../models/article');

const { port, baseUrl: hostname } = require('./../config');

const {
    json_response,
} = require('../utils/utils');

exports.get_all_articles = (req, res) => {
    let statusCode = 200;
    Article.find({})
        // .populate("user")
        .exec((err, articles) => {
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
                    {
                        type: 'getMany',
                        objName: 'article',
                        value: articlesList.length,
                    },
                    obj
                );
            }
        });
};
exports.get_one_article = (req, res) => {
    let statusCode = 202;
    const id = req.params.articleId;
    Article.findById(id, '-__v', (error, article) => {
        if (error) {
            statusCode = 500;
            return res.status(statusCode).json({
                message: 'Internal server error',
            });
        }
        if (!article) {
            statusCode = 404;
            return res
                .status(statusCode)
                .json({ message: 'Article not found' });
        }
        const data = {
            article,
            _options: {
                create: {
                    method: 'POST',
                    link: `http://${hostname}:${port}/articles/create`,
                    properties: {
                        title: 'String',
                        content: 'String',
                        author: 'String',
                    },
                },
                update: {
                    method: 'PUT',
                    link: `http://${hostname}:${port}/articles/${article._id}/update`,
                    properties: {
                        title: 'String',
                        content: 'String',
                        author: 'String',
                    },
                },
                delete: {
                    method: 'DELETE',
                    link: `http://${hostname}:${port}/articles/${article._id}/delete`,
                },
            },
        };
        return res.json(data, req, res, statusCode, 'GET', {
            type: 'getOne',
            objName: 'Article',
        });
    });
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
            return res.status(statusCode).json({
                message: `Article created: ${article.title}`,
                article: new_article,
                author: statusCode,
                requestMethod: 'POST',
            });
        }
    });
};

exports.update_an_article = async (req, res) => {
    const id = req.params.articleId;
    const updateArticle = req.body;
    let statusCode = 202;

    try {
        const isExistArticle = await Article.findById(id);
        if (!isExistArticle) {
            statusCode = 404;
            return res
                .status(statusCode)
                .send({ message: 'Article not found' });
        }
        const article = await Article.findOneAndUpdate(
            { _id: id },
            { $set: updateArticle },
            { new: true }
        );
        const data = {
            updateArticle,
            _options: {
                create: {
                    method: 'POST',
                    link: `http://${hostname}:${port}/articles/create`,
                    properties: {
                        title: 'String',
                        content: 'String',
                        author: 'String',
                    },
                },
                update: {
                    method: 'PUT',
                    link: `http://${hostname}:${port}/articles/${article._id}/update`,
                    properties: {
                        title: 'String',
                        content: 'String',
                        author: 'String',
                    },
                },
                delete: {
                    method: 'DELETE',
                    link: `http://${hostname}:${port}/articles/${article._id}/delete`,
                },
            },
        };
        return res.json(
            data,
            req,
            res,
            statusCode,
            'PUT',
            {
                objName: 'Article',
            },
            { type: 'update' }
        );
    } catch (error) {
        statusCode = 500;
        console.error(';;;;;;;;;;;;;;;;;;;;;;;;;;;;;', error);
        return res
            .status(statusCode)
            .send({ message: 'Internal server error' });
    }
};

exports.delete_an_article = (req, res) => {
    let statusCode = 202;
    const id = req.params.articleId;
    Article.findByIdAndDelete(id, (error, docs) => {
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

        return res.json({
            docs,
            message: 'Article deleted',
            statusCode,
            requestMethod: 'DELETE',
        });
    });
};
