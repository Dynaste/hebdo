require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_TOKEN = process.env.JWT_TOKEN;
const {json_response} = require('../utils/utils');

exports.verify_token = (req, res, next) => {
    const token = req.headers['authorization'];
    let statusCode = 200;

    try {
        if (typeof token !== 'undefined') {
            jwt.verify(token, JWT_TOKEN, async (err) => {
                console.log('secret token', JWT_TOKEN);

                if (err) {
                    statusCode = 403;
                    throw {type: 'forbidden'};
                } else {
                    next();
                }
            })
        } else {
            statusCode = 500;
            throw {type: 'server_error'};
       }
    } catch (err) {
        json_response(req, res, statusCode, 'GET', err, null, true);
        return;
    }
}