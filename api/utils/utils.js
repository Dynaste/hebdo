const {port, baseUrl: hostname} = require('../config');

exports.get_request_path = (req) => {
    return `http://${hostname}:${port}${req.url}`;
}

exports.json_response = (req, res, statusCode, method, objMessage = {type, objName: null, value: null}, data, showRequest = false) => {

    const {type, objName, value} = objMessage;
    const obj = {
        statusCode,
        method,
        message: this.get_response_message(type, objName, value),
        data,
        request: this.get_request_path(req)
    }

    !showRequest && delete obj.request;

    res.status(statusCode)
        .json({
            ...obj
        });
}

/**
 * Get centralized messages to avoid too many differents messages for the same case.
 * @param {string} type
 * Type of the object
 * @param {string} value
 * Any contextual value, but only primitives.
 * @return {string} 
 * The message.
 */
exports.get_response_message = (type, objName, value) => {
    switch(type) {
        case 'update':
            return `Update done`;
        case 'update_no_body':
            return `You must at least update one property`;
        case 'delete':
            return ``;
        case 'create':
            return ``;
        case 'getOne':
            return `${objName} found`;
        case 'getMany':
            return `${value} ${objName}s found`;
        case 'forbidden':
            return ``;
        case 'login':
            return ``;
        case 'signup':
            return ``;
        case 'wrong_id_format':
            return `You entered wrong ID format`;
        case 'server':
            return `Server internal error`;
        case 'empty':
            return `No data found`;
        case '':
            return ``;
        default:
            return `[Error] - ${type} isn't an available value.`;
    }
}

/**
 * Check major cases for update API Method.
 * @param {object} req
 * Request object.
 * @param {string} identifierName
 * Name of the id property from Req object.
 * @param {function} next
 * Callback for additionnal code.
 * @return {void} Nothing
 */
exports.check_update = (req, identifierName = null, next) => {
    if (req.params[`${identifierName}`].length !== 24) {
        statusCode = 400;
        throw {type: 'wrong_id_format'};
    } else if (Object.keys(req.body).length < 1) {
        statusCode = 400;
        throw {type: 'update_no_body'};
    } else {
        next();
    }
}

exports.check_get_one = (req, identifierName = null, next) => {
    if (req.params[`${identifierName}`].length !== 24) {
        statusCode = 400;
        throw 'Wrong id format';
    } else {
        next();
    }
}

/**
 * Check major cases for get API Method
 * @param req
 * Request object.
 * @param next
 * Callback for additionnal code.
 * @return {void} Nothing
 */
exports.check_create_element = (req, next) => {
    if (!Object.keys(req.body).map(prop => {
        return (req.body[`${prop}`] === undefined || req.body[`${prop}`] === null || req.body[`${prop}`] === '');
    }) === false) {
        next();
    }  else {
        throw 'All fields are required';
    }
}