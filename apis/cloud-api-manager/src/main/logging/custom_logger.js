const debug = require('debug');

class CustomLogger {
    constructor(namespace) {
        this._namespace = namespace;
        this._errorDebugLogger = debug(`${namespace}:error`);
        this._infoDebugLogger = debug(`${namespace}:info`);
    }

    info(message) {
        this._infoDebugLogger(message);
    }

    error(message) {
        this._errorDebugLogger(message);
    }
}

module.exports = CustomLogger;
