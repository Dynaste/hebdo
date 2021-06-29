require('dotenv').config();
const Animal = require('../models/animal');
const {baseUrl} = require('../config');

exports.get_all_animals = (req, res) => {

    try {
        Animal.find({}, (err, animals) => {
            if (err) {
                statusCode = 500;
                throw 'Server internal error';
            } else if (animals) {

                const animalsArr = [];

                if (animals.length === 0) {
                    res.status(statusCode)
                        .json({
                            statusCode,
                            method: 'GET',
                            message: `${animals.length} animal(s) found.`,
                            data: animalsArr
                        })
                }

                animals.foreach(animal => {
                    const animalObj = {
                        ...animal,
                        _options: {
                            create: {
                                method: 'POST',
                                link: `http://${baseUrl}/animal/${animal._id}/create`
                            },
                            update: {
                                method: 'PUT',
                                link: `http://${baseUrl}/animal/${animal._id}/update`
                            },
                            delete: {
                                method: 'DELETE',
                                link: `http://${baseUrl}/animal/${animal._id}/delete`
                            }
                        }
                    }

                    animalsArr.push({...animalObj});
                });

                res.status(statusCode).json({
                    statusCode,
                    method: 'GET',
                    message: `${animals.length} animal(s) found.`,
                    data: animalsArr,
                })
            }
        })
    } catch(err) {
        console.log(err);
        res.status(statusCode)
            .json({
                statusCode,
                method: 'GET',
                message: err,
            });
    }
}

exports.get_one_animal = (req, res) => {
    const {animalId} = req.params;
    let statusCode = 200;

    console.log({req});

    try {
        Animal.findOne({id: animalId}, (err, animal) => {
            if (err) {
                statusCode = 500;
                throw 'Server internal error';

            } else if (animal) {

                const objAnimal = {
                    ...animal,
                    _options: {
                        create: {
                            method: 'POST',
                            link: `http://${baseUrl}/animal/${animal._id}/create`
                        },
                        update: {
                            method: 'PUT',
                            link: `http://${baseUrl}/animal/${animal._id}/update`
                        },
                        delete: {
                            method: 'DELETE',
                            link: `http://${baseUrl}/animal/${animal._id}/delete`
                        },
                    }

                }

                res.status(statusCode)
                    .json({
                        statusCode,
                        method: 'GET',
                        data: animal,
                    })
                
            } else {
                statusCode = 404;
                throw 'No data found';
            }
        })
    } catch (err) {
        res.status(statusCode)
            .json({
                statusCode,
                method: 'GET',
                message: err
            })
    }
}

exports.create_animal = (req, res) => {

}

exports.update_animal = (req, res) => {

}

exports.delete_animal = (req, res) => {

}

exports.get_all_animals_from_type = (req, res) => {
    try {

    } catch (err) {
        res.status(statusCode).json({

        })
    }
}

exports.get_one_animal_from_type = (req, res) => {
    
}

exports.get_all_animals_from_type_by_race = (req, res) => {

}

exports.get_one_animal_from_type_by_race = (req, res) => {

}