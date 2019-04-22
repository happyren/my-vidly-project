const winston = require('winston');
// require('winston-mongodb');
require('express-async-errors');
const { combine, timestamp, label, prettyPrint, json } = winston.format;

module.exports = function () {
    process.on('unhandledRejection', (ex) => {
        rejectionLogger.log('error', ex);
        process.exit(1);
    });

    const rejectionLogger = winston.createLogger({
        format: combine(
            timestamp(),
            prettyPrint(),
            json()
        ),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'rejections.log' })
        ]
    });

    winston.configure({
        format: combine(
            timestamp(),
            prettyPrint(),
            json()
        ),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'logfile.log' })
        ],
        exceptionHandlers: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'exceptions.log' })
        ]
    });
}