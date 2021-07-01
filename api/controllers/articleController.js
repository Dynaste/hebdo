const Article = require('../models/article');
const { port, baseUrl: hostname } = require('./../config');
const { json_response, check_create_element } = require('../utils/utils');
const { verify_token } = require('../middlewares/jwtMiddleware');

exports.get_all_articles = (req, res) => {
    let statusCode = 200;
    try {
        Article.find({}, (err, articles) => {
            if (err) {
                statusCode = 500;
                throw {type: 'server_error'};
            } else if (!articles || articles.length === 0) {
                statusCode = 404;
                throw {type: 'not_found'};
            } else if (articles) {
                const articlesList = [];
                articles.forEach((article) => {
                    const newObjArticle = {
                        ...article._doc,
                        link: `http://${hostname}:${port}/articles/${article._id}`,
                    };
                    articlesList.push({ ...newObjArticle });
                });

                const data = {
                    ...articlesList,
                    _options: {
                        create: {
                            method: 'POST',
                            link: `http://${hostname}:${port}/articles/create`,
                            properties: {
                                title: 'String',
                                subtitle: 'String',
                                author: 'String',
                            },
                        },
                    },
                };
                json_response(req, res, statusCode, 'GET', {type: 'get_many', objName: 'article', value: articlesList.length}, data);
                return;

            } else {
                statusCode = 500;
                throw {type: 'unhandled_error'};
            }
        })
    } catch (err) {
        json_response(req, res, statusCode, 'GET', err, data, true);
        return;
    }
};
exports.get_one_article = (req, res) => {
    let statusCode = 202;
    const {articleId} = req.params;
    try {
        if (articleId) {
            Article.findById({_id: articleId}, (error, article) => {
                if (error) {
                    statusCode = 500;
                    json_response(req, res, statusCode, 'GET', {type: ''}, null, true)
                    return;
                } else if (!article) {
                    statusCode = 404;
                    json_response(req, res, statusCode, 'GET', {type: 'not_found', objName: 'Article'}, null, true);
                    return;
                } else if (article) {
                    const data = {
                        article,
                        _options: {
                            create: {
                                method: 'POST',
                                link: `http://${hostname}:${port}/articles/create`,
                                properties: {
                                    title: 'String',
                                    subtitle: 'String',
                                    content: 'String',
                                    author: 'String',
                                },
                            },
                            update: {
                                method: 'PUT',
                                link: `http://${hostname}:${port}/articles/${article._id}/update`,
                                properties: {
                                    title: 'String',
                                    subtitle: 'String',
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
                    json_response(req, res, statusCode, 'GET', {type: 'get_one', objName: 'Article'}, data);
                    return;
                } else {
                    statusCode = 500;
                    throw {type: 'server_error'}
                }
            });
        } else {
            statusCode = 400;
            throw {type: 'id_required'}
        }
    } catch (err) {
        json_response(req, res, statusCode, 'GET', {type: 'get_one', objName: 'Article'}, data, true);
        return;
    }
};

exports.create_an_article = (req, res) => {
    const {title, subtitle, content} = req.body;
    let statusCode = 201;

    try {
        check_create_element(req, Article, async () => {
            verify_token(req, res, false, async (payload) => {
                console.log({payload});

                if (!payload.userId) {
                    statusCode = 500;
                    throw {type: 'server_error'};
                }
                
                const newArticle = await new Article({
                    title,
                    subtitle,
                    content,
                    authorId: payload.userId
                });

                const data = {
                    ...newArticle._doc,
                    _options: {
                        link: `http://${hostname}:${port}/${newArticle._doc._id}`,
                        properties: {
                            title: {
                                type: 'String'
                            },
                            subtitle: {
                                type: 'String'
                            },
                            content: {
                                type: 'String'
                            },
                            authorId: {
                                type: 'String'
                            }
                        }
                    }
                }

                newArticle.save((error) => {
                    if(error) {
                        console.log({error});
                        statusCode = 500;
                        throw { type: 'error_create' }
                    } else {
                        statusCode = 201;
                        json_response(req, res, statusCode, 'POST', {type: 'success_create', objName: 'Article'}, data);
                        return;
                    }
                });
            });
        });
    } catch (err) {
        json_response(req, res, statusCode, 'POST', err, null, true);
        return;
    }
};

exports.update_an_article = async (req, res) => {
    let statusCode = 201;
    const {articleId} = req.params;

    try {
        if (animalId) {
            check_update(req, 'animalId', () => {
                verify_token(req, res, true, async () => {
                    const updatedArticle = await Article.findOneAndUpdate({_id: articleId}, 
                        {
                            ...req.body,
                            _options: {
                                create: {
                                    method: 'POST',
                                    link: `http://${hostname}:${port}/articles/create`,
                                    properties: {
                                        title: 'String',
                                        subtitle: 'String',
                                        content: 'String',
                                        author: 'String',
                                    },
                                },
                                update: {
                                    method: 'PUT',
                                    link: `http://${hostname}:${port}/articles/${article._id}/update`,
                                    properties: {
                                        title: 'String',
                                        subtitle: 'String',
                                        content: 'String',
                                        author: 'String',
                                    },
                                },
                                delete: {
                                    method: 'DELETE',
                                    link: `http://${hostname}:${port}/articles/${article._id}/delete`,
                                },
                            },                        },
                        {
                            upsert: false,
                            new: true,
                            returnOriginal: false
                        })

                    if (updatedAnimal) {
                        json_response(req, res, statusCode, 'PUT', {type: 'success_update', objName: 'Animal', value: updatedAnimal._id}, updatedArticle);
                        return;
                    }
                });
            })
        } else {
            throw 'Id is required.';
        }
    } catch (err) {
        json_response(req, res, statusCode, 'PUT', err, null, true);
        return;
    }
};

exports.delete_an_article = async (req, res) => {
    let statusCode = 204;
    const {articleId} = req.params;

    try {
        if (articleId) {
            verify_token(req, res, true, async () => {
                Animal.findOneAndDelete({_id: articleId}, (err, article) => {
                    if (err) {
                        statusCode = 500;
                        throw {type: 'server_error'};
                    } else if (article) {
                        json_response(req, res, statusCode, 'DELETE', {type: 'success_delete', objName: 'Article', value: article._id}, article);
                        return;
                    } else if (article === null) {
                        statusCode = 404;
                        json_response(req, res, statusCode, 'DELETE', {type: 'not_found', objName: 'Article'}, null, true);
                        return;
                    }
                });
            });
        } else {
            throw {type: 'id_required'};
        }
    } catch (err) {
        json_response(req, res, statusCode, 'DELETE', err, null, true);
        return;
    }
};
