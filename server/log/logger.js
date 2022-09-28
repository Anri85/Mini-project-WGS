const winston = require("winston");

const logConfig = {
    transports: [new winston.transport.Console()],
};

const logger = winston.createLogger(logConfig);

module.exports = logger;
