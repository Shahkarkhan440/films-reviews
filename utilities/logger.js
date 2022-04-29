const { createLogger, format, transports, } = require('winston');

module.exports.usersLogger = createLogger({
    transports:
        new transports.File({
            filename: 'logs/users.log',
            format: format.combine(
                format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
                format.align(),
                format.printf(info => `${info.level}: ${[info.timestamp]} :${info.message}`),
            )
        }),
});

module.exports.authLogger = createLogger({
    transports:
        new transports.File({
            filename: 'logs/auth.log',
            format: format.combine(
                format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
                format.align(),
                format.printf(info => `${info.level}: ${[info.timestamp]} :  ${info.message}`),
            )
        }),
});


module.exports.errorLogger = createLogger({
    transports:
        new transports.File({
            filename: 'logs/errors.log',
            format: format.combine(
                format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
                format.align(),
                format.printf(info => `${info.level}: ${[info.timestamp]} :  ${info.message}`),
            )
        }),
});


module.exports.adminLogger = createLogger({
    transports:
        new transports.File({
            filename: `logs/admin.log`,
            format: format.combine(
                format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
                format.align(),
                format.printf(info => `${info.level}: ${[info.timestamp]} :  ${info.message}`),
            )
        }),
});
