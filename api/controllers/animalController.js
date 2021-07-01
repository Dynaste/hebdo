require('dotenv').config();
const Animal = require('../models/animal');
const {port, baseUrl: hostname} = require('../config');
const jwt = require('jsonwebtoken');
const JWT_TOKEN = process.env.JWT_TOKEN;
const {verify_token} = require('../middlewares/jwtMiddleware');
const {json_response, check_get_one, check_create_element, check_update} = require('../utils/utils');

exports.get_all_animals = (req, res) => {
    let statusCode = 200;

    try {
        Animal.find({}, (err, animals) => {
            if (err) {
                statusCode = 500;
                throw {type: 'server_error'};
            } else if (animals) {
                const animalsArr = [];
                if (animals.length > 0) {
                    animals.foreach(animal => {
                        const animalObj = {
                            ...animal,
                            link: `http://${hostname}:${port}/${animal._id}`,
                            /* _options: {
                                create: {
                                    method: 'POST',
                                    link: `http://${hostname}:${port}/animal/${animal._id}/create`
                                },
                                update: {
                                    method: 'PUT',
                                    link: `http://${hostname}:${port}/animal/${animal._id}/update`
                                },
                                delete: {
                                    method: 'DELETE',
                                    link: `http://${hostname}:${port}/animal/${animal._id}/delete`
                                }
                            } */
                        }

                        animalsArr.push({...animalObj});
                    });
                }
                json_response(req, res, statusCode, 'GET', {type: 'get_many', objName: 'Animal', value: animalsArr.length}, animalsArr);
                return;
            }
        })
    } catch(err) {
        console.log(err);
        json_response(req, res, statusCode, 'GET', err, null, true);
        return;
    }
}

exports.get_one_animal = (req, res) => {
    const {animalId} = req.params;
    let statusCode = 200;
    try {
        check_get_one(req, 'animalId', () => {
            Animal.findOne({id: animalId}, (err, animal) => {
                if (err) {
                    statusCode = 500;
                    throw {type: 'server_error'};

                } else if (animal) {

                    const objAnimal = {
                        ...animal,
                        _options: {
                            create: {
                                method: 'POST',
                                link: `http://${hostname}:${port}/animal/${animal._id}/create`
                            },
                            update: {
                                method: 'PUT',
                                link: `http://${hostname}:${port}/animal/${animal._id}/update`
                            },
                            delete: {
                                method: 'DELETE',
                                link: `http://${hostname}:${port}/animal/${animal._id}/delete`
                            },
                        }

                    }
                    
                    json_response(req, res, statusCode, 'GET', `Animal found.`, objAnimal);
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

exports.create_animal = (req, res) => {
    const {type, race, name, weight, age} = req.body;
    let statusCode = 201;

    try {
        check_create_element(req, async () => {
            verify_token(req, res, async () => {
                await Animal.findOne({race, name, type, age, weight}, async (err, animal) => {
                    if (err) {
                        statusCode = 500;
                        throw {type: 'server_error'};
                    } else if (animal) {
                        json_response(req, res, statusCode, 'POST', {type: 'exist', objName: 'Animal'}, null);
                        return;
    
                    } else if (!animal) {
                        const newAnimal = await new Animal({
                            ...req.body
                        });
    
                        newAnimal.save((error) => {
                            if(!error) {
                                statusCode = 500;
                                json_response(req, res, statusCode, 'POST', {type: 'success_create', objName: 'Animal'}, newAnimal);
                                return;
                            } else {
                                throw { type: 'error_create' }
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

exports.update_animal = async (req, res) => {
    let statusCode = 201;
    const animalId = req.params.animalId;

    try {
        if (animalId) {
            check_update(req, 'animalId', () => {
                verify_token(req, res, async () => {
                    const updatedAnimal = await Animal.findOneAndUpdate({_id: animalId}, req.body, {
                        upsert: false,
                        new: true,
                        returnOriginal: false
                    })

                    if (updatedAnimal) {
                        json_response(req, res, statusCode, 'PUT', `Animal ${updatedAnimal._id} has been successfully updated.`, updatedAnimal);
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

exports.delete_animal = (req, res) => {
    let statusCode = 201;
    const animalId = req.params.animalId;

    try {
        if (animalId) {
            verify_token(req, res, () => {
                Animal.findOneAndDelete({_id: animalId}, (err, animal) => {
                    if (err) {
                        statusCode = 500;
                        throw {type: 'server_error'};
                    } else if (animal) {
                        json_response(req, res, statusCode, 'DELETE', {type: 'success_delete'}, animal);
                        return;
                    }
                })
            })
        } else {
            throw {type: 'id_required'};
        }
    } catch (err) {
        json_response(req, res, statusCode, 'DELETE', err, null, true);
        return;
    }
}