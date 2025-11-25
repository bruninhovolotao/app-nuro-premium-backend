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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = void 0;
const prisma_client_1 = require("../database/prisma.client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = require("crypto");
const http_error_1 = require("../utils/http.error");
class loginService {
    signup(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, email, username, password, tipo }) {
            const existingUser = yield prisma_client_1.prismaClient.user.findFirst({
                where: {
                    username: username,
                    email: email
                }
            });
            if (existingUser) {
                throw new Error("Usuário já cadastrado");
            }
            const passwordCripted = yield bcrypt_1.default.hash(password, 10);
            const newUser = yield prisma_client_1.prismaClient.user.create({
                data: {
                    name,
                    email,
                    username,
                    password: passwordCripted,
                }
            });
            const { password: _ } = newUser, userPartial = __rest(newUser, ["password"]);
            return userPartial;
        });
    }
    list(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_client_1.prismaClient.user.findMany({
                where: { id: userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    username: true,
                    password: true
                }
            });
            return user;
        });
    }
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = data;
            let user = yield prisma_client_1.prismaClient.user.findFirst({
                where: { username }
            });
            if (!user) {
                throw new http_error_1.HTTPError(401, "Usuário não encontrado");
            }
            const validPassword = yield bcrypt_1.default.compare(password, user.password);
            if (!validPassword) {
                throw new http_error_1.HTTPError(401, "Senha inválida");
            }
            const token = (0, crypto_1.randomUUID)();
            user = yield prisma_client_1.prismaClient.user.update({
                where: { id: user.id },
                data: { authToken: token },
            });
            const { password: _ } = user, usuarioSemSenha = __rest(user, ["password"]);
            return { user: usuarioSemSenha, token };
        });
    }
    getByToken(authToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_client_1.prismaClient.user.findFirst({
                where: { authToken },
            });
            return user;
        });
    }
    update(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, name, email, username, password }) {
            const dataUpdate = {};
            if (name !== undefined)
                dataUpdate.name = name;
            if (email !== undefined)
                dataUpdate.email = email;
            if (username !== undefined)
                dataUpdate.username = username;
            if (password) {
                const passwordCripted = yield bcrypt_1.default.hash(password, 10);
                dataUpdate.password = passwordCripted;
            }
            const updateUser = yield prisma_client_1.prismaClient.user.update({
                where: { id },
                data: dataUpdate
            });
            const { password: _ } = updateUser, userPartial = __rest(updateUser, ["password"]);
            return userPartial;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExists = yield prisma_client_1.prismaClient.user.findUnique({
                where: { id }
            });
            if (!userExists) {
                throw new http_error_1.HTTPError(404, "Usuário não encontrado.");
            }
            yield prisma_client_1.prismaClient.user.delete({
                where: userExists
            });
        });
    }
}
exports.loginService = loginService;
