require('dotenv').config();
const Animal = require('../models/animal');
const {port, baseUrl: hostname} = require('../config');
const {verify_token} = require('../middlewares/jwtMiddleware');
const {
    json_response,
    check_get_one,
    check_create_element,
    check_update,
    capitalize
} = require('../utils/utils');
const { animalTypes } = require('../models/animalTypes');

exports.get_all_animals = (req, res) => {
    let statusCode = 200;

    try {
        Animal.find({}, (err, animals) => {
            if (err) {
                statusCode = 500;
                throw {type: 'server_error'};
            } else if (animals) {
                console.log(animals)
                let animalsArr = [];
                if (animals.length > 0) {
                    
                    animals.forEach(animal => {
                        const animalObj = {
                            ...animal._doc,
                            type: animalTypes[animal._doc.type],
                            link: `http://${hostname}:${port}/animals/${animal._id}`,
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
                                }
                            }
                        }

                        animalsArr .push({...animalObj});
                    });
                }
                json_response(req, res, statusCode, 'GET', {type: 'get_many', objName: 'Animal', value: animalsArr.length}, animalsArr );
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
        check_get_one(req, 'animalId', async () => {
            Animal.findOne({_id: animalId}, (err, animal) => {
                console.log({animal})
                if (err) {
                    statusCode = 500;
                    throw {type: 'server_error'};

                } else if (animal) {

                    console.log({animal})

                    const objAnimal = {
                        ...animal._doc,
                        type: animalTypes[animal._doc.type],
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
                    
                    json_response(req, res, statusCode, 'GET', {type: 'get_one', objName: 'Animal'}, objAnimal);
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
        check_create_element(req, Animal, async () => {
            verify_token(req, res, true, async () => {
                await Animal.findOne({race, name, type, age, weight}, async (err, animal) => {
                    if (err) {
                        statusCode = 500;
                        throw {type: 'server_error'};
                    } else if (animal) {
                        statusCode = 409;
                        json_response(req, res, statusCode, 'POST', {type: 'exist', objName: 'Animal'}, null);
                        return;
    
                    } else if (!animal) {
                        const newAnimal = await new Animal({
                            type: type,
                            race: capitalize(race),
                            name: capitalize(name),
                            weight,
                            age,
                            adoptDate: null,
                            adopterId: null
                        });

                        const data = {
                            ...newAnimal._doc,
                            _options: {
                                link: `http://${hostname}:${port}/${newAnimal._doc._id}`,
                                properties: {
                                    type: {
                                        type: 'Enumeration',
                                        data: [
                                            "Chien",
                                            "Chat",
                                            "Cheval",
                                            "Rat",
                                            "Lapin",
                                            "Furet"
                                        ]
                                    },
                                    race: {
                                        type: 'String'
                                    },
                                    name: {
                                        type: 'String'
                                    },
                                    age: {
                                        type: 'Number'
                                    },
                                    weight: {
                                        type: 'Number'
                                    }
                                }
                            }
                        }
    
                        newAnimal.save((error) => {
                            if(error) {
                                statusCode = 500;
                                throw { type: 'error_create' }
                            } else {
                                statusCode = 201;
                                json_response(req, res, statusCode, 'POST', {type: 'success_create', objName: 'Animal'}, data);
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

exports.update_animal = async (req, res) => {
    let statusCode = 201;
    const animalId = req.params.animalId;

    try {
        if (animalId) {
            check_update(req, 'animalId', async () => {
                verify_token(req, res, true, async () => {
                    const updatedAnimal = await Animal.findOneAndUpdate({_id: animalId}, 
                        {
                            ...req.body,
                            type: req.body.type,
                        },
                        {
                            upsert: false,
                            new: true,
                            returnOriginal: false
                        })

                    if (updatedAnimal) {
                        json_response(req, res, statusCode, 'PUT', {type: 'success_update', objName: 'Animal', value: updatedAnimal._id}, updatedAnimal);
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
    let statusCode = 204;
    const {animalId} = req.params;

    try {
        if (animalId) {
            verify_token(req, res, true, async () => {
                Animal.findOneAndDelete({_id: animalId}, (err, animal) => {
                    if (err) {
                        statusCode = 500;
                        throw {type: 'server_error'};
                    } else if (animal) {
                        json_response(req, res, statusCode, 'DELETE', {type: 'success_delete', objName: 'Animal', value: animal._id}, animal);
                        return;
                    } else if (!animal) {
                        statusCode = 404;
                        throw {type: 'not_found', objName: 'Animal'};
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