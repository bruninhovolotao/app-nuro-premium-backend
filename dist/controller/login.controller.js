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
class loginController {
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const service = new login_service_1.loginService();
                const resultado = yield service.signup(req.body);
                res.status(201).json({
                    sucess: true,
                    message: 'usuário criado com sucesso',
                    data: resultado
                });
            }
            catch (error) {
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.loginController = loginController;
