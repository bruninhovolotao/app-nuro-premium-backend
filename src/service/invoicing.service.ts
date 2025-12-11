import { prismaClient } from "../database/prisma.client";

export class InvoicingService {
    public async invoicing(startDate?: string, endDate?: string, unidade?: string) {
        const dateFilter = startDate && endDate ? {
          date: {
            gte: new Date(`${startDate}T00:00:00.000Z`),
            lte: new Date(`${endDate}T23:59:59.999Z`)
          }
        } : {};

        const unidadeFilter = unidade ? { unidade } : {}
      
        // Busca todas as transações financeiras no período
        const transactions = await prismaClient.financialTransaction.findMany({
          where: {
            ...dateFilter,
            ...unidadeFilter
          },
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
            stone: 0,
            geral: 0,
        };
        
        for (const t of transactions) {
            const amount = Number(t.totalAmount);

            const method = t.paymentMethod.toLowerCase();

            if (method.includes("dinheiro")) totals.dinheiro += amount;
            else if (method.includes("pix") || method.includes("pix")) totals.pix += amount;
            else if (method.includes("presente") || method.includes("presente")) totals.presente += amount;
            else if (method.includes("despesa")) totals.despesa += amount;
            else if (method.includes("stone")) totals.stone += amount;

            totals.geral += amount;
        }
      
        return {
          unidade: unidade || "Todas",
          periodo: {
            start: startDate || null,
            end: endDate || null,
          },
          quantidadeRegistros: transactions.length,
          totals,
          transactions,
          }
        };
    }
