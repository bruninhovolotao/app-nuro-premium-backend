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
exports.professionalController = void 0;
const on_error_1 = require("../utils/on-error");
const professional_service_1 = require("../service/professional.service");
const prisma_client_1 = require("../database/prisma.client");
class professionalController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const service = new professional_service_1.professionalService();
                const results = yield service.create(req.body);
                res.status(201).json({
                    sucess: true,
                    message: 'Profissional cadastrado com sucesso',
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
                const service = new professional_service_1.professionalService();
                const list = yield service.list();
                res.status(200).json({
                    sucess: true,
                    message: 'Lista de Profissionais carregada com sucesso',
                    data: list
                });
            }
            catch (error) {
                (0, on_error_1.onError)(error, res);
            }
        });
    }
    professionalSearch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.query;
            try {
                const results = yield prisma_client_1.prismaClient.professional.findMany({
                    where: {
                        name: {
                            contains: String(name || ""),
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
                        message: "Nenhum profissional encontrado com esse nome.",
                        data: [],
                    });
                }
                res.status(200).json({
                    sucess: true,
                    message: 'Profissional encontrado com sucesso!',
                    data: results
                });
            }
            catch (error) {
                (0, on_error_1.onError)(error, res);
            }
        });
    }
    professionalReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const professionalId = Number(req.params.id);
            const { unidade, startDate, endDate } = req.query;
            try {
                const service = new professional_service_1.professionalService();
                const report = yield service.professionalReport(professionalId, unidade, startDate, endDate);
                res.status(200).json({
                    sucess: true,
                    message: 'Dados do Profissional carregados com sucesso',
                    data: report
                });
            }
            catch (error) {
                (0, on_error_1.onError)(error, res);
            }
        });
    }
    professionalInvoicing(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const professionalId = Number(req.params.id);
            const { startDate, endDate } = req.query;
            try {
                const service = new professional_service_1.professionalService();
                const report = yield service.professionalInvoicing(professionalId, startDate, endDate);
                res.status(200).json({
                    sucess: true,
                    message: 'Dados do Profissional carregados com sucesso',
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
                const service = new professional_service_1.professionalService();
                const updatedClient = yield service.update(id, data);
                res.status(201).json({
                    sucess: true,
                    message: 'Profissional atualizado com sucesso',
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
                const service = new professional_service_1.professionalService();
                const deletedClient = yield service.delete(id);
                res.status(200).json({
                    sucess: true,
                    message: 'Profissional deletado com sucesso',
                });
            }
            catch (error) {
                return (0, on_error_1.onError)(error, res);
            }
        });
    }
}
exports.professionalController = professionalController;
