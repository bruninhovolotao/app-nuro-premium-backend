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
exports.transactionService = void 0;
const client_1 = require("@prisma/client");
const prisma_client_1 = require("../database/prisma.client");
const http_error_1 = require("../utils/http.error");
class transactionService {
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validação do cliente
            const client = yield prisma_client_1.prismaClient.client.findFirst({
                where: { name: dto.clientName },
            });
            if (!client) {
                throw new http_error_1.HTTPError(401, "Cliente não informado");
            }
            // Validação do serviço (pode ter mais de um)
            let services = [];
            if (dto.serviceName && dto.serviceName.length > 0) {
                for (const serviceName of dto.serviceName) {
                    const service = yield prisma_client_1.prismaClient.service.findFirst({
                        where: { name: serviceName },
                    });
                    if (!service) {
                        throw new http_error_1.HTTPError(401, `Serviço não encontrado: ${serviceName}`);
                    }
                    services.push({ id: service.id, price: service.price });
                }
            }
            // Validação dos produtos (pode ter mais de um)
            let products = [];
            if (dto.productName && dto.productName.length > 0) {
                for (const productName of dto.productName) {
                    const product = yield prisma_client_1.prismaClient.product.findFirst({
                        where: { name: productName },
                    });
                    if (!product) {
                        throw new http_error_1.HTTPError(401, `Produto não encontrado: ${productName}`);
                    }
                    products.push({ id: product.id, price: product.price });
                }
            }
            // Validação do profissional
            const professional = yield prisma_client_1.prismaClient.professional.findFirst({
                where: { name: dto.professionalName },
            });
            if (!professional) {
                throw new http_error_1.HTTPError(401, "Profissional não informado");
            }
            // Cálculo do totalAmount (serviço + soma dos produtos)
            const servicesTotal = services.reduce((acc, p) => acc.add(p.price), new client_1.Prisma.Decimal(0));
            const productsTotal = products.reduce((acc, p) => acc.add(p.price), new client_1.Prisma.Decimal(0));
            const totalAmount = new client_1.Prisma.Decimal(servicesTotal).add(productsTotal);
            // Criação da transação financeira
            const transaction = yield prisma_client_1.prismaClient.financialTransaction.create({
                data: {
                    date: new Date(),
                    serviceDate: dto.serviceDate,
                    totalAmount,
                    paymentMethod: dto.paymentMethod,
                    notes: dto.notes,
                    clientId: client.id,
                    professionalId: professional.id,
                    services: {
                        create: services.map((p) => ({
                            serviceId: p.id,
                            quantity: 1 // ou ajuste conforme necessário
                        }))
                    },
                    products: {
                        create: products.map((p) => ({
                            productId: p.id,
                            quantity: 1 // ou ajuste conforme necessário
                        }))
                    }
                },
                include: {
                    client: true,
                    professional: true,
                    services: { include: { service: true } },
                    products: { include: { product: true } }
                }
            });
            return transaction;
        });
    }
}
exports.transactionService = transactionService;
