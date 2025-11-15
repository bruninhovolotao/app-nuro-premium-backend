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
exports.professionalService = void 0;
const client_1 = require("@prisma/client");
const prisma_client_1 = require("../database/prisma.client");
const http_error_1 = require("../utils/http.error");
class professionalService {
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verifica se o profissional já existe
            const existingProfessional = yield prisma_client_1.prismaClient.professional.findFirst({
                where: { name: dto.name },
            });
            if (existingProfessional) {
                throw new http_error_1.HTTPError(400, "Profissional já cadastrado");
            }
            const newProfessional = yield prisma_client_1.prismaClient.professional.create({
                data: {
                    name: dto.name,
                    productCommission: new client_1.Prisma.Decimal(dto.productCommission || 0),
                    serviceCommission: new client_1.Prisma.Decimal(dto.serviceCommission || 0),
                }
            });
            return newProfessional;
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const services = yield prisma_client_1.prismaClient.professional.findMany({
                select: {
                    id: true,
                    name: true,
                    serviceCommission: true,
                    productCommission: true,
                },
            });
            return services;
        });
    }
    professionalReport(professionalId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateFilter = startDate && endDate ? {
                date: {
                    gte: new Date(`${startDate}T00:00:00.000Z`),
                    lte: new Date(`${endDate}T23:59:59.999Z`)
                }
            } : {};
            // Busca o profissional
            const professional = yield prisma_client_1.prismaClient.professional.findUnique({
                where: { id: professionalId },
            });
            if (!professional) {
                throw new Error('Profissional não encontrado');
            }
            // Busca todas as transações de serviços financeiras no período
            const transactions = yield prisma_client_1.prismaClient.financialTransaction.findMany({
                where: Object.assign(Object.assign({}, dateFilter), { OR: [
                        { serviceItems: { some: { professionalId } } },
                        { productItems: { some: { professionalId } } }
                    ] }),
                include: {
                    serviceItems: true,
                    productItems: true
                }
            });
            // Agrupamento e cálculos
            let totalServices = 0;
            let totalServiceValue = 0;
            let totalProducts = 0;
            let totalProductValue = 0;
            // Percorre todas as transações e soma os itens do profissional
            for (const transaction of transactions) {
                // Serviços
                const serviceItems = transaction.serviceItems.filter(s => s.professionalId === professionalId);
                for (const s of serviceItems) {
                    const price = Number(s.price) || 0;
                    const qty = s.quantity || 1;
                    totalServices += qty;
                    totalServiceValue += qty * price;
                }
                // Produtos
                const productItems = transaction.productItems.filter(p => p.professionalId === professionalId);
                for (const p of productItems) {
                    const price = Number(p.price) || 0;
                    const qty = p.quantity || 1;
                    totalProducts += qty;
                    totalProductValue += qty * price;
                }
            }
            const commissionRateService = Number(professional.serviceCommission) / 100;
            const commissionServiceValue = totalServiceValue * commissionRateService;
            const valueToReceiveServices = commissionServiceValue;
            const commissionRateProduct = Number(professional.productCommission) / 100;
            const commissionProductValue = totalProductValue * commissionRateProduct;
            const valueToReceiveProduct = commissionProductValue;
            const valueToReceiveTotal = valueToReceiveServices + valueToReceiveProduct;
            return {
                professional: {
                    id: professional.id,
                    name: professional.name,
                },
                periodo: {
                    start: startDate || null,
                    end: endDate || null,
                },
                serviceItems: {
                    QuantityService: totalServices,
                },
                productItems: {
                    QuantityProduct: totalProducts,
                },
                total: {
                    service: {
                        total: totalServiceValue,
                        commission: professional.serviceCommission,
                        toReceive: valueToReceiveServices,
                    },
                    product: {
                        total: totalProductValue,
                        commission: professional.productCommission,
                        toReceive: valueToReceiveProduct,
                    },
                    totalReceive: valueToReceiveTotal
                },
            };
        });
    }
}
exports.professionalService = professionalService;
