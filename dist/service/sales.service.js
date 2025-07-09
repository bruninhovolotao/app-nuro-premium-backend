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
exports.salesService = void 0;
const client_1 = require("@prisma/client");
const prisma_client_1 = require("../database/prisma.client");
const http_error_1 = require("../utils/http.error");
class salesService {
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            // Buscar o profissional:
            const product = yield prisma_client_1.prismaClient.product.findFirst({
                where: { name: dto.productName }
            });
            if (!product) {
                throw new http_error_1.HTTPError(404, "Produto não encontrado");
            }
            // Buscar o profissional:
            const professional = yield prisma_client_1.prismaClient.professional.findFirst({
                where: { name: dto.professionalName }
            });
            if (!professional) {
                throw new http_error_1.HTTPError(404, "Profissional não encontrado");
            }
            // Pega a taxa de comissão:
            const commissionRate = professional.productCommission || new client_1.Prisma.Decimal(0);
            // Cria o registro da venda:
            const productSale = yield prisma_client_1.prismaClient.productSale.create({
                data: {
                    date: new Date(),
                    quantity: dto.quantity,
                    unitPrice: product.price,
                    totalPrice: product.price.mul(dto.quantity),
                    commissionRate, // 💡 Usando a taxa de comissão do profissional
                    productId: product.id,
                    professionalId: professional.id,
                }
            });
            return productSale;
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const services = yield prisma_client_1.prismaClient.product.findMany({
                select: {
                    id: true,
                    name: true,
                    price: true,
                },
            });
            return services;
        });
    }
}
exports.salesService = salesService;
