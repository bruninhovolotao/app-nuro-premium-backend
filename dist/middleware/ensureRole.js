"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureTipo = ensureTipo;
const on_error_1 = require("../utils/on-error");
const http_error_1 = require("../utils/http.error");
const client_1 = require("@prisma/client");
function ensureTipo(req, res, next) {
    try {
        const user = req.user;
        if (!client_1.Tipo) {
            throw new http_error_1.HTTPError(500, "Tipo enum não está definido.");
        }
        if (!user) {
            throw new http_error_1.HTTPError(401, "Usuário não autenticado");
        }
        if ((user === null || user === void 0 ? void 0 : user.tipo) === client_1.Tipo.USER) {
            throw new http_error_1.HTTPError(403, "Acesso negado para esse recurso");
        }
        return next();
    }
    catch (error) {
        (0, on_error_1.onError)(error, res);
    }
}
