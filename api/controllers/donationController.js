require('dotenv').config();
const Donation = require('../models/donation');
const {port, baseUrl: hostname} = require('../config');
const {verify_token} = require('../middlewares/jwtMiddleware');
const {
    json_response,
    check_create_element
} = require('../utils/utils');

exports.get_all_donations = (req, res) => {
    let statusCode = 200;

    try {
        Donation.find({}, (err, donations) => {
            if (err) {
                statusCode = 500;
                throw {type: 'server_error'};
            } else if (donations) {
                console.log(donations)
                let donationsArr = [];
                if (donations.length > 0) {
                    
                    donations.forEach(donation => {

                        User.findOne({_id: userId}, (err, user) => {
                            if (err) {
                                statusCode = 500;
                                throw {type: 'server_error'};
                            } else if (user) {
                                const don = {...donation._doc};
                                delete don.userId;
                                const donationObj = {
                                    user: {
                                        ...user._doc
                                    },
                                    ...don,
                                    link: `http://${hostname}:${port}/${donation._id}`,
                                }
                                donationsArr.push({...donationObj});
                            } else {
                                throw {type: 'unhandled_error'}
                            }
                        })
                    });
                }
                json_response(req, res, statusCode, 'GET', {type: 'get_many', objName: 'Donation', value: donationsArr.length}, donationsArr );
                return;
            }
        })
    } catch(err) {
        console.log(err);
        json_response(req, res, statusCode, 'GET', err, null, true);
        return;
    }
}

exports.create_donation = (req, res) => {
    const {amount} = req.body;
    let statusCode = 201;

    try {
        check_create_element(req, Donation, async () => {
            verify_token(req, res, false, async () => {
                const newDonation = await new Donation({
                    userId,
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
                        json_response(req, res, statusCode, 'POST', {type: 'success_create', objName: 'Donation'}, data);
                        return;
                    }
                })
            })
        })
    } catch (err) {
        json_response(req, res, statusCode, 'POST', err, null, true);
        return;
    }
}