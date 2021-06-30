require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_TOKEN = process.env.JWT_TOKEN;

exports.verify_token = (req, res, next) => {
    let token = req.header['authorization'];
    let statusCode = 200;

    try {
        if (typeof token !== 'undefined') {
            jwt.verify(token, JWT_TOKEN, (err) => {
                console.log('secret token', JWT_TOKEN);

                if (err) {
                    statusCode = 403;
                    throw "Forbidden access";
                } else {
                    next();
                }
            })
        } else {
            statusCode = 500;
            throw 'Server internal error';
       }
    } catch (err) {
        res.status(statusCode)
            .json({
                statusCode,
                request_method: 'GET',
                message: err,
                data: null
            })
    }
}