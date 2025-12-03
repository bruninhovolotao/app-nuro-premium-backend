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
const prisma_client_1 = require("../database/prisma.client");
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
    TransactionsSearch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.query;
            try {
                const results = yield prisma_client_1.prismaClient.client.findMany({
                    where: {
                        name: {
                            contains: String(name),
                            mode: 'insensitive',
                        },
                    },
                    select: {
                        id: true,
                        name: true,
                    },
                    orderBy: {
                        name: 'asc',
                    },
                });
                if (results.length === 0) {
                    res.status(404).json({
                        success: false,
                        message: "Nenhum cliente encontrado com esse nome.",
                        data: [],
                    });
                }
                res.status(200).json({
                    sucess: true,
                    message: 'Atendimento encontrado com sucesso.',
                    data: results
                });
            }
            catch (error) {
                (0, on_error_1.onError)(error, res);
            }
        });
    }
    TransactionsReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientId = Number(req.params.id);
            const { startDate, endDate } = req.query;
            try {
                const service = new transaction_service_1.transactionService();
                const report = yield service.TransactionsReport(clientId, startDate, endDate);
                if (report.length === 0) {
                    res.status(404).json({
                        success: false,
                        message: 'Este cliente ainda não possui transações registradas.',
                        data: [],
                    });
                }
                res.status(200).json({
                    sucess: true,
                    message: 'Dados do Cliente carregados com sucesso',
                    data: report
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
                }
                const service = new transaction_service_1.transactionService();
                const updatedTransaction = yield service.update(id, req.body);
                res.status(201).json({
                    sucess: true,
                    message: 'Atendimento atualizado com sucesso',
                    data: updatedTransaction
                });
            }
            catch (error) {
                return (0, on_error_1.onError)(error, res);
            }
        });
    }
}
exports.transitionsController = transitionsController;
