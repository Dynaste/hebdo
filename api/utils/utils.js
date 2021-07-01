const {port, baseUrl: hostname} = require('../config');

exports.get_request_path = (req) => {
    return `http://${hostname}:${port}${req.url}`;
}

/**
 * Generic function to send data from Backend.
 * @param {object} req Request object.
 * @param {object} res Response object.
 * @param {number} statusCode Status code (Ex: 200, 404, 500)
 * @param {string} method API Method used
 * @param {object} objMessage Message object to define which message to display
 * @param {object} data Data sent 
 * @param {boolean} showRequest Define if the request path has to be displayed
 * @return {void}
 */
exports.json_response = (req, res, statusCode, method, objMessage = {type, objName: null, value: null}, data, showRequest = false) => {

    // console.log({objMessage});
    const {type, objName, value} = objMessage;
    const obj = {
        statusCode,
        method,
        message: this.get_response_message(type, objName, value),
        data,
        request: this.get_request_path(req)
    }

    // console.log({obj});

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
        // LOGIN
        case 'success_login':
            return `Successfully logged-in`;
        case 'email_pwd_couple_error':
            return `Invalid couple Email/Password`;

        // GET
        case 'get_one':
            return `${objName} found`;
        case 'get_many':
            return `${value} ${objName}s found`;

        // UPDATE
        case 'update':
            return `Update done`;
        case 'update_no_body':
            return `You must at least update one property`;

        // DELETE
        case 'success_delete':
            return `${objName} ${value} has been successfully deleted.`;

        // CREATE
        case 'fields_required':
            return `All fields are required`;
        case 'success_create':
            return `${objName} successfully created`;
        case 'error_create':
            return `${objName} hasn't been created`;

        // ERROR
        case 'id_required':
            return `Id is required`;
        case 'no_data':
            return `No data found`;
        case 'wrong_id_format':
            return `You entered wrong ID format`;
        case 'server_error':
            return `Server internal error`;
        case 'error_occured':
            return `An error has occured`;
        case 'not_found':
            return `${objName} not found`;
        case 'exist':
            return `This ${objName} already exist`;
        case 'not_exist':
            return `This ${objName} not exist`;
        case 'forbidden':
            return `Forbidden access`;
        case 'unhandled_error':
            return `Unhandled Error at ${value}`;
        

            
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

    console.log(req.body)

    const valueIsMissing = Object.keys(req.body).map(prop => {
        return (req.body[`${prop}`] === undefined || req.body[`${prop}`] === null || req.body[`${prop}`] === '');
    });

    console.log({valueIsMissing});

    if (!valueIsMissing) {
        next();
    }  else if (valueIsMissing) {
        throw {type: 'fields_required'};
    } else {
        throw {type: 'unhandled_error', value: 'CheckCreateElement'}
    }
}