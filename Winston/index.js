const winston = require('winston');
const { combine, timestamp, json } = winston.format;
const winstonDailyRotateFile = require('winston-daily-rotate-file');
const { MailTransport } = require('winston-mail');

const customPrint = winston.format.printf(args => {
    return `[${ args.timestamp }][${ args.level }] : ${ args.message }`
})
const logger = winston.createLogger({
    level: 'info',
    defaultMeta: { component: 'user-service' },
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        json(),
        customPrint
    ),
    transports: [
        // log into console
        new winston.transports.Console(),
        // log in combined.log file
        new winston.transports.File({ filename: 'combined.log' }),
        // create file based on date, and log in that file
        new winstonDailyRotateFile({
            filename: './logs/%DATE%.log',
        }),
        // transport logs to remote server over HTTP. This is useful for centralized logging in distributed systems.
        /*new winston.transports.Http({
            host: process.env.HOST,
            port: process.env.PORT,
            path: '/log',
            method: 'POST'
        }), */
        // Sending logs via email. This is useful for critical error notifications.
        /*new MailTransport({
            to: process.env.targetEmail,
            from: process.env.sourceEmail,
            subject: 'Error Log'
        }),*/
    ],
});

logger.info('This is an info');
logger.warn('This is a warning');
logger.error('This is an error');

console.log('End of file...');