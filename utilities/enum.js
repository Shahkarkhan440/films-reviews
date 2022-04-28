
const userAccStatuses = Object.freeze({
    active: "active",
    blocked: "blocked",
})

const filmStatuses = Object.freeze({
    active: "active",
    disabled: "in-active",
})

const allowedRatings = Object.freeze({
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
})



const httpStatuses = Object.freeze({
    ok: 200,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    methodNotAllowed: 405,
    notAcceptable: 406,
    conflict: 409,
    unsupportedMediaType: 415,
    payloadTooLarge: 413,
    internalServerError: 500,
});


module.exports = { userAccStatuses, filmStatuses, allowedRatings, httpStatuses };