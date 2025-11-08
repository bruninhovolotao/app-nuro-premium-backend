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
exports.productService = void 0;
const client_1 = require("@prisma/client");
const prisma_client_1 = require("../database/prisma.client");
class productService {
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingProduct = yield prisma_client_1.prismaClient.product.findFirst({
                where: {
                    name: dto.name
                }
            });
            if (existingProduct) {
                throw new Error("Serviço já cadastrado");
            }
            // const priceDecimal = new Decimal(dto.price);
            const priceDecimal = new client_1.Prisma.Decimal(dto.price);
            const newProduct = yield prisma_client_1.prismaClient.product.create({
                data: {
                    name: dto.name,
                    price: dto.price
                }
            });
            return newProduct;
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
exports.productService = productService;
