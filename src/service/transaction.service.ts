import { FinancialTransaction, Prisma } from "@prisma/client";
import { prismaClient } from "../database/prisma.client";
import { TransitionsDTO } from "../dto/transaction.dto";
import { HTTPError } from "../utils/http.error";
import { Decimal } from "@prisma/client/runtime/library";

export class transactionService {
  public async create(dto: TransitionsDTO): Promise<FinancialTransaction> {
    // Validação do cliente
    const client = await prismaClient.client.findFirst({
      where: { name: dto.clientName },
    });
    if (!client) {
      throw new HTTPError(400, "Cliente não informado");
    }

    // Validação dos serviços
    let services: { name: string; price: Prisma.Decimal, quantity: number, professionalId: number }[] = [];

    if (!dto.services || dto.services.length === 0) {
      throw new HTTPError(400, "É necessário informar pelo menos um serviço.");
    }

    for (const service of dto.services) {
      if (!service.name || service.name.trim() === "") {
        throw new HTTPError(400, "O nome do serviço não pode estar em branco.");
      }

      if (typeof service.price !== "number" || service.price <= 0) {
        throw new HTTPError(400, `Preço inválido para o serviço: ${service.name}`);
      }

      if (!service.professionalName || service.professionalName.trim() === "") {
        throw new HTTPError(400, `Profissional não informado para o produto: ${service.name}`);
      }

      const professional = await prismaClient.professional.findFirst({
        where: { name: service.professionalName },
      });

      if (!professional) {
      throw new HTTPError(400, "Profissional não informado para o serviço");
      }

      services.push({
        name: service.name.trim(),
        price: service.price,
        quantity: service.quantity,
        professionalId: professional.id
      });
    }

    // Validação dos produtos
    let products: { name: string; price: Prisma.Decimal, quantity: number, professionalId: number }[] = [];

    if (dto.products && dto.products.length > 0) {
      for (const product of dto.products) {
        if (typeof product.name !== "string" || product.name.trim() === "") continue;
        if (typeof product.price !== "number" || product.price < 0) continue;

        const professional = await prismaClient.professional.findFirst({
        where: { name: product.professionalName },
      });

      if (!professional) {
      throw new HTTPError(401, "Profissional não informado para o produto");
      }

        products.push({
          name: product.name.trim(),
          price: product.price,
          quantity: product.quantity,
          professionalId: professional.id
        });
      }
    }

    // Cálculo do totalAmount (serviço + soma dos produtos)
    const servicesTotal = services.reduce((acc, p) => acc.add(p.price), new Prisma.Decimal(0));
    const productsTotal = products.reduce((acc, p) => acc.add(p.price), new Prisma.Decimal(0));
    const totalAmount = new Prisma.Decimal(servicesTotal).add(productsTotal);

    // Acerta o fuso horário
    const dataNow = new Date();
    dataNow.setHours(dataNow.getHours() -3)

    // Criação da transação financeira
    const transaction = await prismaClient.financialTransaction.create({
      data: {
        date: dataNow,
        totalAmount,
        paymentMethod: dto.paymentMethod,
        notes: dto.notes,
        unidade: dto.unidade,
        clientId: client.id,
        serviceItems: {
          create: services.map((s) => ({
            name: s.name,
            price: s.price,
            quantity: s.quantity,
            professionalId: s.professionalId,
          }))
      },
        productItems: {
          create: products.map((p) => ({
            name: p.name,
            price: p.price,
            quantity: p.quantity,
            professionalId: p.professionalId,
          }))
        }
      },
      include: {
        client: true,
        serviceItems: true,
        productItems: true
      }
    });

    return transaction;
  }
  public async TransactionsReport(clientId: number, startDate?: string, endDate?: string) {
        const whereClause: any = {
          clientId,
        };
  
        if (startDate && endDate) {
          whereClause.date = {
            gte: new Date(`${startDate}T00:00:00.000Z`),
            lte: new Date(`${endDate}T23:59:59.999Z`),
          };
        }
  
        const transactions = await prismaClient.financialTransaction.findMany({
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
        }});
  
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
            total: new Decimal(s.price).mul(s.quantity),
          })),
          produtos: t.productItems.map((p) => ({
            nome: p.name,
            quantidade: p.quantity,
            valorUnitario: p.price,
            profissional: p.professional.name,
            total: new Decimal(p.price).mul(p.quantity),
          })),
        }));
  }   
    
}
