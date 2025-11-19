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
exports.invoicingController = void 0;
const invoicing_service_1 = require("../service/invoicing.service");
const on_error_1 = require("../utils/on-error");
class invoicingController {
    invoicing(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { startDate, endDate } = req.query;
            try {
                const service = new invoicing_service_1.InvoicingService();
                const report = yield service.invoicing(startDate, endDate);
                res.status(200).json({
                    sucess: true,
                    message: 'Dados de faturamento carregados com sucesso',
                    data: report
                });
            }
            catch (error) {
                (0, on_error_1.onError)(error, res);
            }
        });
    }
}
exports.invoicingController = invoicingController;
