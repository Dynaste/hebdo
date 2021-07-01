require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_TOKEN = process.env.JWT_TOKEN;
const {json_response} = require('../utils/utils');

exports.verify_token = (req, res, adminOnly = false, next) => {
    const token = req.headers['authorization'];
    let statusCode = 200;

    try {
        if (typeof token !== 'undefined') {
            jwt.verify(token, JWT_TOKEN, async (err, payload) => {
                console.log({req})
                console.log({adminOnly})
                console.log('secret token', JWT_TOKEN);
                if (err) {
                    statusCode = 403;
                    throw {type: 'forbidden'};
                } else {
                    if (adminOnly && payload['role'] === 'admin') {
                        next({userId: payload['id']});
                    } else if (adminOnly && payload['role'] !== 'admin') {
                        statusCode = 403;
                        throw {type: 'admin_only'};
                    } else if (!adminOnly && (payload['role'] === 'user' || payload['role'] === 'admin')) {
                        next({userId: payload['id']});
                    } else {
                        statusCode = 500;
                        throw {type: 'server_error'};
                    }
                }
            }).catch(err => {
                json_response(req, res, statusCode, req.method, err, null, true);
                return;
            });
        } else {
            statusCode = 500;
            throw {type: 'server_error'};
       }
    } catch (err) {
        json_response(req, res, statusCode, req.method, err, null, true);
        return;
    }
}