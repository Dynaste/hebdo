require('dotenv').config();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const validator = ('validator');
const JWT_TOKEN = process.env.JWT_TOKEN;
const {port, baseUrl: hostname} = require('./../config');

exports.get_all_users = (req, res) => {
    let statusCode = 200;
    
    try {
        User.find({}, (err, users) => {
            if (err) {
                statusCode = 500;
                throw 'Server internal error.';
            } else {
                res.status(statusCode).json({
                    statusCode,
                    method: 'POST',
                    message: "You received the users list",
                    data: {
                        ...users,
                        _options: {
                            create: {
                                method: 'POST',
                                link: `http://${hostname}:${port}/users/create`,
                                properties: {
                                    email: 'String',
                                    password: 'String',
                                    role: 'String'
                                }
                            }
                        }
                    }
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(statusCode)
        .json({
            statusCode,
            method: 'POST',
            message: err
        });
    }
}

exports.get_one_user = (req, res) => {
    let statusCode = 200;
    const {userId} = req.params.userId;
    let error;

    try {
        User.findOne({_id: userId}, (err, user) => {
            if (err) {
                statusCode = 500;
                throw "Server internal error";

            } else if (user) {
                
                console.log("User exist")
                console.log({user});
                res.status(statusCode)
                .json({
                    statusCode,
                    method: 'GET',
                    message: "User found",
                    data: {
                        ...user,
                        _options: {
                            create: {
                                method: 'POST',
                                link: `http://${hostname}:${port}/users/create`,
                                properties: {
                                    email: 'String',
                                    password: 'String',
                                    role: 'String'
                                }
                            },
                            update: {
                                method: 'PUT',
                                link: `http://${hostname}:${port}/users/${user._id}/update`,
                                properties: {
                                    email: 'String',
                                    password: 'String',
                                    role: 'String'
                                }
                            },
                            delete: {
                                method: 'DELETE',
                                link: `http://${hostname}:${port}/users/${user._id}/delete`
                            },
                        }
                    },
                    
                })
            } else {
                statusCode = 404;
                error = new Error("User not found")
                throw error;
            }
        })
    } catch (err) {
        console.log({err});
        console.log("User not exist")
        res.json({
            statusCode,
            method: 'GET',
            message: err
        })
    }
}

exports.update_one_user = (req, res) => {

}

exports.delete_one_user = (req, res) => {

}

exports.login = (req, res) => {
    let statusCode = 202;

    try {
        const { email, password } = req.body;

        if (email && password) {
            User.findOne({email}, (err, user) => {
                if (err) {
                    statusCode = 401
                    throw "Invalid Email and/or password"
                } else if (user) {
                    if (req.body.password, user.password) {
                        jwt.sign({email: user.email, role: user.role}, JWT_TOKEN, {expiresIn: "24 hour"}, (err, token) => {
                            if (err) {
                                console.log({err})
                                statusCode = 500;
                                throw "Server internal error";
                            } else if (token) {
                                console.log("Successfully logged")
                                res.status(statusCode)
                                .json({
                                    statusCode,
                                    method: 'POST',
                                    message: "Successfully logged-in",
                                    data: token
                                })
                            } else {
                                throw "An error has occured"
                            }
                        });
                    } else {
                        throw "The couple Email/Password is not working"
                    }
                } else {
                    statusCode = 404;
                    throw "Email not exist"
                }
            });
        } else {
            statusCode = 500;
            throw "All fields are required"
        }
       
    } catch (err) {
        res.status(statusCode)
        .json({
            statusCode,
            method: 'POST',
            message: err
        })
    }
}

exports.signup = async (req, res) => {
    let statusCode = 201;
    const { role, email, password } = req.body;
    
    try {
        if ( role && email && password) {
            if (!validator.isEmail(email)) {
                statusCode = 400;
                throw "Email don't have the right format.";
            } else if (password === "" || password === null) {
                throw "You have to set a password"
            } else {
                User.findOne({email}, async (err, user) => {
                    if (err) {
                        throw err;
                    } else {
                        const newUser = await new User({
                            role: role,
                            email: email.toLowerCase(),
                            password: password, 
                        });
                        
                        newUser.save((error, data) => {
                            if (error) {
                                statusCode = 500;
                                res.status(statusCode)
                                .json({
                                    statusCode,
                                    method: 'POST',
                                    message: "Server internal error",
                                    data: null
                                })
                            } else {
                                console.log("User has been saved")
                                const createdUser = {...data._doc};
                                delete createdUser.password;
                                res.status(statusCode)
                                .json({
                                    statusCode,
                                    method: 'POST',
                                    message: "User successfully created",
                                    data: {
                                        ...createdUser,
                                        _options: {
                                            login: {
                                                method: 'POST',
                                                link: `http://${hostname}:${port}/login`,
                                                properties: {
                                                    email: 'String',
                                                    password: 'String'
                                                }
                                            },
                                        }
                                    }
                                })
                            }
                        })
                    }
                })
            }            
        } else {
            throw "All fields are required"
        }

    } catch (err) {
        statusCode = 500;
        console.log("[Error]")
        res.status(statusCode)
        .json({
            statusCode,
            method: 'POST',
            message: err,
            user: null
        })
    }
}