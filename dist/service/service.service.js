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
exports.serviceService = void 0;
const prisma_client_1 = require("../database/prisma.client");
const library_1 = require("@prisma/client/runtime/library");
class serviceService {
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingService = yield prisma_client_1.prismaClient.client.findFirst({
                where: {
                    name: dto.name
                }
            });
            if (existingService) {
                throw new Error("Serviço já cadastrado");
            }
            const priceDecimal = new library_1.Decimal(dto.price);
            const newService = yield prisma_client_1.prismaClient.service.create({
                data: {
                    name: dto.name,
                    price: priceDecimal
                }
            });
            return newService;
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const services = yield prisma_client_1.prismaClient.service.findMany({
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
exports.serviceService = serviceService;
