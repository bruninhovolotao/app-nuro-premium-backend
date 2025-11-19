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
exports.InvoicingService = void 0;
const prisma_client_1 = require("../database/prisma.client");
class InvoicingService {
    invoicing(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateFilter = startDate && endDate ? {
                date: {
                    gte: new Date(`${startDate}T00:00:00.000Z`),
                    lte: new Date(`${endDate}T23:59:59.999Z`)
                }
            } : {};
            // Busca todas as transações financeiras no período
            const transactions = yield prisma_client_1.prismaClient.financialTransaction.findMany({
                where: Object.assign({}, dateFilter),
                select: {
                    date: true,
                    paymentMethod: true,
                    totalAmount: true,
                }
            });
            if (transactions.length === 0) {
                throw new Error("Nenhum registro encontrado para o período selecionado.");
            }
            // --- Totais por método ---
            const totals = {
                dinheiro: 0,
                pix: 0,
                presente: 0,
                despesa: 0,
                geral: 0,
            };
            for (const t of transactions) {
                const amount = Number(t.totalAmount);
                const method = t.paymentMethod.toLowerCase();
                if (method.includes("dinheiro"))
                    totals.dinheiro += amount;
                else if (method.includes("pix") || method.includes("pix"))
                    totals.pix += amount;
                else if (method.includes("presente") || method.includes("presente"))
                    totals.presente += amount;
                else if (method.includes("despesa"))
                    totals.despesa += amount;
                totals.geral += amount;
            }
            return {
                periodo: {
                    start: startDate || null,
                    end: endDate || null,
                },
                quantidadeRegistros: transactions.length,
                totals,
                transactions,
            };
        });
    }
    ;
}
exports.InvoicingService = InvoicingService;
