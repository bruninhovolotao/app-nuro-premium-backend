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
exports.transitionsController = void 0;
const on_error_1 = require("../utils/on-error");
const transaction_service_1 = require("../service/transaction.service");
class transitionsController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const service = new transaction_service_1.transactionService();
                const results = yield service.create(req.body);
                res.status(201).json({
                    sucess: true,
                    message: 'Lançamento gerado com sucesso',
                    data: results
                });
            }
            catch (error) {
                return (0, on_error_1.onError)(error, res);
            }
        });
    }
}
exports.transitionsController = transitionsController;
