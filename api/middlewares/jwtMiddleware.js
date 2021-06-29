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
                    throw "Forbidden access";
                } else {
                    next();
                }
            })
        } else {
            throw 'Forbidden access';
       }
    } catch (err) {
        statusCode = 403;
        res.status(statusCode)
            .json({
                statusCode,
                request_method: 'GET',
                message: err
            })
    }
}