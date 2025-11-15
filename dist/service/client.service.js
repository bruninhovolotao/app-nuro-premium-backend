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
const library_1 = require("@prisma/client/runtime/library");
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
                whereClause.date = {
                    gte: new Date(`${startDate}T00:00:00.000Z`),
                    lte: new Date(`${endDate}T23:59:59.999Z`),
                };
            }
            const transactions = yield prisma_client_1.prismaClient.financialTransaction.findMany({
                where: whereClause,
                orderBy: {
                    date: "desc",
                },
                include: {
                    client: true,
                    serviceItems: {
                        include: {
                            professional: true
                        }
                    },
                    productItems: {
                        include: {
                            professional: true
                        },
                    },
                }
            });
            return transactions.map((t) => ({
                id: t.id,
                dataAtendimento: t.date,
                metodoPagamento: t.paymentMethod,
                valorTotal: t.totalAmount,
                observacoes: t.notes,
                servicos: t.serviceItems.map((s) => ({
                    nome: s.name,
                    quantidade: s.quantity,
                    valorUnitario: s.price,
                    profissional: s.professional.name,
                    total: new library_1.Decimal(s.price).mul(s.quantity),
                })),
                produtos: t.productItems.map((p) => ({
                    nome: p.name,
                    quantidade: p.quantity,
                    valorUnitario: p.price,
                    profissional: p.professional.name,
                    total: new library_1.Decimal(p.price).mul(p.quantity),
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
