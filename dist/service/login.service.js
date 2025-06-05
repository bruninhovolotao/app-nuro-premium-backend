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
class loginService {
    signup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = data;
            const existingUser = yield prisma_client_1.prismaClient.User.findFirst({
                where: {
                    email: email
                }
            });
            if (existingUser) {
                throw new Error("E-mail já cadastrado");
            }
            const passwordCripted = yield bcrypt_1.default.hash(password, 10);
            const newUser = yield prisma_client_1.prismaClient.User.create({
                data: {
                    name,
                    email,
                    password: passwordCripted
                }
            });
            const { password: _ } = newUser, userPartial = __rest(newUser, ["password"]);
            return userPartial;
        });
    }
}
exports.loginService = loginService;
