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
exports.loginController = void 0;
const login_service_1 = require("../service/login.service");
const on_error_1 = require("../utils/on-error");
class loginController {
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const service = new login_service_1.loginService();
                const resultado = yield service.signup(req.body);
                res.status(201).json({
                    sucess: true,
                    message: 'Usuário criado com sucesso',
                    data: resultado
                });
            }
            catch (error) {
                (0, on_error_1.onError)(error, res);
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                const service = new login_service_1.loginService();
                const results = yield service.login({ username, password });
                res.status(201).json({
                    sucess: true,
                    message: "Usuário logado com sucesso",
                    dados: results
                });
            }
            catch (error) {
                (0, on_error_1.onError)(error, res);
            }
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = Number(req.params.id);
            try {
                const service = new login_service_1.loginService();
                const list = yield service.list(userId);
                res.status(200).json({
                    sucess: true,
                    message: "Dados do usuário carregado com sucesso",
                    dados: list
                });
            }
            catch (error) {
                (0, on_error_1.onError)(error, res);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id, 10);
                if (isNaN(id)) {
                    res.status(400).json({ message: "ID inválido." });
                    return;
                }
                const { name, email, username, password } = req.body;
                const service = new login_service_1.loginService();
                const updateUser = yield service.update({ id, name, email, username, password });
                res.status(200).json({
                    sucess: true,
                    message: "Usuário atualizado com sucesso",
                    dados: updateUser
                });
            }
            catch (error) {
                (0, on_error_1.onError)(error, res);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id, 10);
                if (isNaN(id)) {
                    res.status(400).json({
                        message: 'ID inválido'
                    });
                }
                const service = new login_service_1.loginService();
                const results = yield service.delete(id);
                res.status(201).json({
                    sucess: true,
                    message: "Usuário deletado com sucesso",
                    dados: results
                });
            }
            catch (error) {
                (0, on_error_1.onError)(error, res);
            }
        });
    }
}
exports.loginController = loginController;
