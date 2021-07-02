require('dotenv').config();
const Donation = require('../models/donation');
const User = require('../models/user');
const {port, baseUrl: hostname} = require('../config');
const {verify_token} = require('../middlewares/jwtMiddleware');
const {
    json_response,
    check_create_element
} = require('../utils/utils');

exports.get_all_donations = (req, res) => {
    let statusCode = 200;

    try {
        Donation.find({}, async (err, donations) => {
            if (err) {
                statusCode = 500;
                throw {type: 'server_error'};
            } else if (donations) {
                if (donations.length > 0) {
                    let donationsArr = [];
                    donations.forEach(donation => {
                        User.findOne({_id: donation.userId}, async (err, user) => {
                            if (err) {
                                statusCode = 500;
                                throw {type: 'server_error'};
                            } else if (user) {
                                const don = {...donation._doc};

                                delete don.userId;

                                const usr = {...user._doc};

                                delete usr.password;
                                delete usr._id;
                                delete usr.__v;

                                const donationObj = {
                                    user: {
                                        ...usr
                                    },
                                    ...don,
                                }
                                console.log({donationObj});
                                donationsArr.push({...donationObj});
                            } else {
                                throw {type: 'unhandled_error'}
                            }
                        });
                    });
                    console.log({donationsArr})
                    json_response(req, res, statusCode, {type: 'get_many', objName: 'Donation', value: donations.length}, donationsArr );
                    return;
                } else {
                    throw {type: 'no_data'};
                }
            }
        })
    } catch(err) {
        json_response(req, res, statusCode, err, null, true);
        return;
    }
}

exports.create_donation = (req, res) => {
    const {amount} = req.body;
    let statusCode = 201;

    try {
        check_create_element(req, Donation, async () => {
            verify_token(req, res, false, async (payload) => {
                const newDonation = await new Donation({
                    userId: payload['userId'],
                    date: new Date(),
                    amount
                });

                const data = {
                    ...newDonation._doc,
                    _options: {
                        link: `http://${hostname}:${port}/${newDonation._doc._id}`,
                        properties: {
                            userId: {
                                type: 'String'
                            },
                            amount: {
                                type: 'Number'
                            }
                        }
                    }
                }

                newDonation.save((error) => {
                    if(error) {
                        statusCode = 500;
                        throw { type: 'error_create' }
                    } else {
                        statusCode = 201;
                        json_response(req, res, statusCode, {type: 'success_create', objName: 'Donation'}, data);
                        return;
                    }
                })
            })
        })
    } catch (err) {
        json_response(req, res, statusCode, err, null, true);
        return;
    }
}