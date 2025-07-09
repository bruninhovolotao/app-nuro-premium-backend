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
exports.clientService = void 0;
const prisma_client_1 = require("../database/prisma.client");
const http_error_1 = require("../utils/http.error");
class clientService {
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const newClient = yield prisma_client_1.prismaClient.client.create({
                data: {
                    name: dto.name,
                }
            });
            return newClient;
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const clients = yield prisma_client_1.prismaClient.client.findMany({
                select: {
                    id: true,
                    name: true,
                },
            });
            return clients;
        });
    }
    ClientReport(clientId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const whereClause = {
                clientId,
            };
            if (startDate && endDate) {
                whereClause.serviceDate = {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                };
            }
            const transactions = yield prisma_client_1.prismaClient.financialTransaction.findMany({
                where: whereClause,
                orderBy: {
                    serviceDate: "desc",
                },
                include: {
                    client: true,
                    professional: true,
                    services: {
                        include: {
                            service: true,
                        },
                    },
                    products: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
            return transactions.map((t) => ({
                id: t.id,
                dataAtendimento: t.serviceDate,
                metodoPagamento: t.paymentMethod,
                valorTotal: t.totalAmount,
                profissional: t.professional.name,
                observacoes: t.notes,
                servicos: t.services.map((s) => ({
                    nome: s.service.name,
                    quantidade: s.quantity,
                    valorUnitario: s.service.price,
                    total: s.service.price.mul(s.quantity),
                })),
                produtos: t.products.map((p) => ({
                    nome: p.product.name,
                    quantidade: p.quantity,
                    valorUnitario: p.product.price,
                    total: p.product.price.mul(p.quantity),
                })),
            }));
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const clientExists = yield prisma_client_1.prismaClient.client.findUnique({
                where: { id }
            });
            if (!clientExists) {
                throw new http_error_1.HTTPError(404, "Cliente não encontrado.");
            }
            const updatedClient = yield prisma_client_1.prismaClient.client.update({
                where: { id },
                data: {
                    name: (_a = data.name) !== null && _a !== void 0 ? _a : clientExists.name
                }
            });
            return updatedClient;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientExists = yield prisma_client_1.prismaClient.client.findUnique({
                where: { id }
            });
            if (!clientExists) {
                throw new http_error_1.HTTPError(404, "Cliente não encontrado");
            }
            yield prisma_client_1.prismaClient.client.delete({
                where: { id }
            });
        });
    }
}
exports.clientService = clientService;
