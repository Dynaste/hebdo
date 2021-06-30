require('dotenv').config();
const Animal = require('../models/animal');
const {port, baseUrl: hostname} = require('../config');
const jwt = require('jsonwebtoken');
const JWT_TOKEN = process.env.JWT_TOKEN;
const verify_token = require('../middlewares/jwtMiddleware');
const {get_request_path, check_get_one, check_create_element, check_update} = require('../utils/utils');

exports.get_all_animals = (req, res) => {
    let statusCode = 200;

    try {
        Animal.find({}, (err, animals) => {
            if (err) {
                statusCode = 500;
                throw 'Server internal error';
            } else if (animals) {
                const animalsArr = [];
                if (animals.length === 0) {
                    json_response(req, res, statusCode, 'GET', `${animals.length} animal(s) found.`, animalsArr);
                }

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
                json_response(req, res, statusCode, 'GET', `${animals.length} animal(s) found.`, animalsArr);
            }
        })
    } catch(err) {
        console.log(err);
        json_response(req, res, statusCode, 'GET', err, null, true);
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
                    throw {type: 'server'};

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
                    
                } else {
                    statusCode = 404;
                    throw {type: 'empty'};
                }
            });   
        });
    } catch (err) {
        json_response(req, res, statusCode, 'GET', err, null, true);
    }
}

exports.create_animal = (req, res) => {
    const {type, race, name, weight, age} = req.body;
    let statusCode = 200;

    try {
        check_create_element(req, () => {
            verify_token(req, res, () => {
                Animal.findOne({race, name, type, age, weight}, async (err, animal) => {
                    if (err) {
                        statusCode = 500;
                        throw 'Server internal error';
                    } else if (animal) {
                        res.status(statusCode)
                            .json({
                                statusCode,
                                method: 'POST',
                                message: 'This Animal already exist.',
                                data: null
                            })
    
                    } else if (!animal) {
                        const newAnimal = await new Animal({
                            ...req.body
                        });
    
                        newAnimal.save((error) => {
                            if(error) {
                                statusCode = 500;
                                json_response(req, res, statusCode, 'POST', `Animal Successfully created`, newAnimal);
                            }
                        })
                    }
                })
            })
        })
    } catch (err) {
        json_response(req, res, statusCode, 'POST', err, null, true);
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
                    }
                });
            })
        } else {
            throw 'Id is required.';
        }
    } catch (err) {
        json_response(req, res, statusCode, 'PUT', err, null, true);
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
                        throw 'Server internal error';
                    } else if (animal) {
                        json_response(req, res, statusCode, 'DELETE', `Animal ${animal._id} has been successfully deleted.`, animal);
                    }
                })
            })
        }
    } catch (err) {
        json_response(req, res, statusCode, 'DELETE', err, null, true);
    }
}