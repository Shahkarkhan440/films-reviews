const { httpStatuses } = require("../utilities/enum")

const isSuccess = (status) => {
    let response = { success: false };
    switch (status) {
        case httpStatuses.ok:
            response = { success: true }
            break;
        case httpStatuses.badRequest:
            response = { success: false }
            break;
        case httpStatuses.unauthorized:
            response = { success: false }
            break;
        case httpStatuses.forbidden:
            response = { success: false }
            break;
        case httpStatuses.notFound:
            response = { success: false }
            break;
        case httpStatuses.methodNotAllowed:
            response = { success: false }
            break;
        case httpStatuses.notAcceptable:
            response = { success: false }
            break;
        case httpStatuses.conflict:
            response = { success: false }
            break;
        case httpStatuses.unsupportedMediaType:
            response = { success: false }
            break;
        case httpStatuses.payloadTooLarge:
            response = { success: false }
            break;
        case httpStatuses.internalServerError:
            response = { success: false }
            break;
        default:
            response = { success: false }
    }
    return response;
}


module.exports.responseHandler = (request, response, statusCode, body, loggerBody = null, cb) => {
    if (cb) {
        cb()
    }

    let success = isSuccess(statusCode)
    body = { ...success, ...body }

    if (statusCode == 500 && loggerBody !== null) {
        loggerBody.result = null;
        loggerBody.message = loggerBody.message ? loggerBody.message : null;

        logger.errorLogger.info(loggerBody)
        return response.status(statusCode).send(body);
    } else {
        return response.status(statusCode).send(body);
    }
};


module.exports.passwordStrengthChecker = (password) => {
    let re = /^(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return re.test(password);
}
