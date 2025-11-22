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
exports.clientController = void 0;
const on_error_1 = require("../utils/on-error");
const client_service_1 = require("../service/client.service");
const prisma_client_1 = require("../database/prisma.client");
class clientController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const service = new client_service_1.clientService();
                const results = yield service.create(req.body);
                res.status(201).json({
                    sucess: true,
                    message: 'Cliente cadastrado com sucesso',
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
                const service = new client_service_1.clientService();
                const list = yield service.list();
                res.status(200).json({
                    sucess: true,
                    message: 'Lista de clientes carregada com sucesso',
                    data: list
                });
            }
            catch (error) {
                (0, on_error_1.onError)(error, res);
            }
        });
    }
    ClientSearch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.query;
            try {
                const results = yield prisma_client_1.prismaClient.client.findMany({
                    where: {
                        name: {
                            contains: String(name),
                            mode: 'insensitive', // ignora maiúsculas/minúsculas
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
                    message: 'Cliente encontrado com sucesso',
                    data: results
                });
            }
            catch (error) {
                (0, on_error_1.onError)(error, res);
            }
        });
    }
    ClientReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientId = Number(req.params.id);
            const { startDate, endDate } = req.query;
            try {
                const service = new client_service_1.clientService();
                const report = yield service.ClientReport(clientId, startDate, endDate);
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
                const data = req.body;
                const service = new client_service_1.clientService();
                const updatedClient = yield service.update(id, data);
                res.status(201).json({
                    sucess: true,
                    message: 'Cliente atualizado com sucesso',
                    data: updatedClient
                });
            }
            catch (error) {
                return (0, on_error_1.onError)(error, res);
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
                const service = new client_service_1.clientService();
                const deletedClient = yield service.delete(id);
                res.status(200).json({
                    sucess: true,
                    message: 'Cliente deletado com sucesso',
                });
            }
            catch (error) {
                return (0, on_error_1.onError)(error, res);
            }
        });
    }
}
exports.clientController = clientController;
