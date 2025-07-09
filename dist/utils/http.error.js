"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPError = void 0;
class HTTPError extends Error {
    constructor(statusCode, messageError) {
        super(messageError);
        this.statusCode = statusCode;
    }
}
exports.HTTPError = HTTPError;
