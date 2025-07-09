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
exports.salesController = void 0;
const on_error_1 = require("../utils/on-error");
const sales_service_1 = require("../service/sales.service");
class salesController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const service = new sales_service_1.salesService();
                const results = yield service.create(req.body);
                res.status(201).json({
                    sucess: true,
                    message: 'Venda cadastrada com sucesso',
                    data: results
                });
            }
            catch (error) {
                return (0, on_error_1.onError)(error, res);
            }
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const service = new sales_service_1.salesService();
                const list = yield service.list();
                res.status(200).json({
                    sucess: true,
                    message: 'Lista vendas carregada com sucesso',
                    data: list
                });
            }
            catch (error) {
                (0, on_error_1.onError)(error, res);
            }
        });
    }
}
exports.salesController = salesController;
