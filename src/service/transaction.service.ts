import { FinancialTransaction, Prisma } from "@prisma/client";
import { prismaClient } from "../database/prisma.client";
import { TransitionsDTO } from "../dto/transaction.dto";
import { HTTPError } from "../utils/http.error";

export class transactionService {
  public async create(dto: TransitionsDTO): Promise<FinancialTransaction | null> {
    // Validação do cliente
    const client = await prismaClient.client.findFirst({
      where: { name: dto.clientName },
    });
    if (!client) {
      throw new HTTPError(401, "Cliente não informado");
    }

    // Validação do serviço (pode ter mais de um)
    let services: { id: number; price: Prisma.Decimal }[] = [];
    if (dto.serviceName && dto.serviceName.length > 0) {
      for (const serviceName of dto.serviceName) {
        const service = await prismaClient.service.findFirst({
          where: { name: serviceName },
        });
        if (!service) {
          throw new HTTPError(401, `Serviço não encontrado: ${serviceName}`);
        }
        services.push({ id: service.id, price: service.price });
      }
    }

    // Validação dos produtos (pode ter mais de um)
    let products: { id: number; price: Prisma.Decimal }[] = [];
    if (dto.productName && dto.productName.length > 0) {
      for (const productName of dto.productName) {
        const product = await prismaClient.product.findFirst({
          where: { name: productName },
        });
        if (!product) {
          throw new HTTPError(401, `Produto não encontrado: ${productName}`);
        }
        products.push({ id: product.id, price: product.price });
      }
    }

    // Validação do profissional
    const professional = await prismaClient.professional.findFirst({
      where: { name: dto.professionalName },
    });
    if (!professional) {
      throw new HTTPError(401, "Profissional não informado");
    }

    // Cálculo do totalAmount (serviço + soma dos produtos)
    const servicesTotal = services.reduce((acc, p) => acc.add(p.price), new Prisma.Decimal(0));
    const productsTotal = products.reduce((acc, p) => acc.add(p.price), new Prisma.Decimal(0));
    const totalAmount = new Prisma.Decimal(servicesTotal).add(productsTotal);

    // Criação da transação financeira
    const transaction = await prismaClient.financialTransaction.create({
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
  }
}
