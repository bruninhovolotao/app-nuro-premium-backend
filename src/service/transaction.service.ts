import { FinancialTransaction, Prisma } from "@prisma/client";
import { prismaClient } from "../database/prisma.client";
import { TransitionsDTO } from "../dto/transaction.dto";
import { HTTPError } from "../utils/http.error";

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

    // Criação da transação financeira
    const transaction = await prismaClient.financialTransaction.create({
      data: {
        date: new Date(dto.transactionDate),
        totalAmount,
        paymentMethod: dto.paymentMethod,
        notes: dto.notes,
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
}
