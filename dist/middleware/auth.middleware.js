"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autenticarToken = autenticarToken;
const on_error_1 = require("../utils/on-error");
const http_error_1 = require("../utils/http.error");
const login_service_1 = require("../service/login.service");
function autenticarToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                throw new http_error_1.HTTPError(401, "Token de autenticação não informado.");
            }
            const [bearer, token] = authHeader.split(" ");
            if (bearer !== "Bearer" || !token) {
                throw new http_error_1.HTTPError(401, "Token de autenticação mal formatado.");
            }
            const service = new login_service_1.loginService();
            const userFound = yield service.getByToken(token);
            if (!userFound) {
                throw new http_error_1.HTTPError(401, "Token de autenticação inválido.");
            }
            req.user = {
                id: userFound.id,
                name: userFound.name,
                email: userFound.email,
                tipo: userFound.tipo
            };
            return next();
        }
        catch (error) {
            return (0, on_error_1.onError)(error, res);
        }
    });
}
