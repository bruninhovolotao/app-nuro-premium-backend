"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onError = onError;
const http_error_1 = require("./http.error");
function onError(error, res) {
    if (error instanceof http_error_1.HTTPError) {
        res.status(error.statusCode).json({
            sucess: false,
            message: error.message,
        });
        return;
    }
    res.status(500).json({
        sucess: false,
        message: "Ocorreu um erro inesperado",
        details: error.message,
    });
}
