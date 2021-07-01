require('dotenv').config();
const Product = require('../models/product');
const {port, baseUrl: hostname} = require('../config');
const {verify_token} = require('../middlewares/jwtMiddleware');
const {
    json_response,
    check_get_one,
    check_create_element,
    check_update,
    capitalize
} = require('../utils/utils');
const {productCategories} = require('../models/static/productCategories');


exports.get_all_products = (req, res) => {
    let statusCode = 200;
    try {
        Product.find({}, (err, products) => {
            if (err) {
                statusCode = 500;
                throw {type: 'server_error'};
            } else if (products) {
                let productsArr = [];
                if (products.length > 0) {
                    products.forEach(product => {
                        const productObj = {
                            ...product._doc,
                            category: productCategories[product._doc.category],
                            link: `http://${hostname}:${port}/products/${product._id}`,
                            _options: {
                                create: {
                                    method: 'POST',
                                    link: `http://${hostname}:${port}/products/${product._id}/create`
                                },
                                update: {
                                    method: 'PUT',
                                    link: `http://${hostname}:${port}/products/${product._id}/update`
                                },
                                delete: {
                                    method: 'DELETE',
                                    link: `http://${hostname}:${port}/products/${product._id}/delete`
                                }
                            }
                        }
                        productsArr .push({...productObj});
                    });
                }
                json_response(req, res, statusCode, 'GET', {type: 'get_many', objName: 'Product', value: productsArr.length}, productsArr );
                return;
            }
        })
    } catch(err) {
        json_response(req, res, statusCode, 'GET', err, null, true);
        return;
    }
}

exports.get_one_product = (req, res) => {
    const {productId} = req.params;
    let statusCode = 200;
    try {
        check_get_one(req, 'productId', async () => {
            Product.findOne({_id: productId}, (err, product) => {
                if (err) {
                    statusCode = 500;
                    throw {type: 'server_error'};

                } else if (product) {
                    const objProduct = {
                        ...product._doc,
                        category: productCategories[product._doc.category],
                        _options: {
                            create: {
                                method: 'POST',
                                link: `http://${hostname}:${port}/products/${product._id}/create`
                            },
                            update: {
                                method: 'PUT',
                                link: `http://${hostname}:${port}/products/${product._id}/update`
                            },
                            delete: {
                                method: 'DELETE',
                                link: `http://${hostname}:${port}/products/${product._id}/delete`
                            },
                        }
                    }
                    json_response(req, res, statusCode, 'GET', {type: 'get_one', objName: 'Product'}, objProduct);
                    return;
                    
                } else {
                    statusCode = 404;
                    throw {type: 'empty'};
                }
            });   
        });
    } catch (err) {
        json_response(req, res, statusCode, 'GET', err, null, true);
        return;
    }
}

exports.create_product = (req, res) => {
    const {name, category} = req.body;
    let statusCode = 201;

    try {
        check_create_element(req, Product, async () => {
            verify_token(req, res, true, async () => {
                await Product.findOne({name, category}, async (err, product) => {
                    if (err) {
                        statusCode = 500;
                        throw {type: 'server_error'};
                    } else if (product) {
                        statusCode = 409;
                        json_response(req, res, statusCode, 'POST', {type: 'exist', objName: 'Product'}, null);
                        return;
    
                    } else if (!product) {
                        const newProduct = await new Product({
                            ...req.body,
                            name: capitalize(name)
                        });

                        const data = {
                            ...newProduct._doc,
                            _options: {
                                link: `http://${hostname}:${port}/products/${newProduct._doc._id}`,
                                properties: {
                                    name: {
                                        type: 'String'
                                    },
                                    category: {
                                        type: 'String'
                                    },
                                    description: {
                                        type: 'String'
                                    }
                                }
                            }
                        }
    
                        newProduct.save((error) => {
                            if(error) {
                                statusCode = 500;
                                throw { type: 'error_create' }
                            } else {
                                statusCode = 201;
                                json_response(req, res, statusCode, 'POST', {type: 'success_create', objName: 'Product'}, data);
                                return;
                            }
                        })
                    }
                })
            })
        })
    } catch (err) {
        json_response(req, res, statusCode, 'POST', err, null, true);
        return;
    }
}

exports.update_product = async (req, res) => {
    let statusCode = 201;
    const {productId} = req.params;

    try {
        if (productId) {
            check_update(req, 'productId', async () => {
                verify_token(req, res, true, async () => {
                    const updatedProduct = await Product.findOneAndUpdate({_id: productId}, 
                        {
                            ...req.body,
                            name: capitalize(name)
                        },
                        {
                            upsert: false,
                            new: true,
                            returnOriginal: false
                        })

                    if (updatedProduct) {
                        json_response(req, res, statusCode, 'PUT', {type: 'success_update', objName: 'Product', value: updatedProduct._id}, updatedProduct);
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
}

exports.delete_product = (req, res) => {
    let statusCode = 204;
    const {productId} = req.params;

    try {
        if (productId) {
            verify_token(req, res, true, async () => {
                Product.findOneAndDelete({_id: productId}, (err, product) => {
                    if (err) {
                        statusCode = 500;
                        throw {type: 'server_error'};
                    } else if (product) {
                        json_response(req, res, statusCode, 'DELETE', {type: 'success_delete', objName: 'Product', value: product._id}, product);
                        return;
                    } else if (!product) {
                        statusCode = 404;
                        throw {type: 'not_found', objName: 'Product'};
                    }
                })
            })
        } else {
            statusCode = 400;
            throw {type: 'id_required'};
        }
    } catch (err) {
        json_response(req, res, statusCode, 'DELETE', err, null, true);
        return;
    }
}