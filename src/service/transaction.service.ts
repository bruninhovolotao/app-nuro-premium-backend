import { FinancialTransaction, Prisma } from "@prisma/client";
import { prismaClient } from "../database/prisma.client";
import { TransitionsDTO } from "../dto/transaction.dto";

export class transactionService {
    public async create(dto: TransitionsDTO): Promise<FinancialTransaction | null>{

      const client = await prismaClient.client.findFirst({
        where: { name: dto.clientName },
      });
      if (!client) {
        throw new Error("Cliente não encontrado");
      }

      const professional = await prismaClient.professional.findFirst({
        where: { name: dto.professionalName },
      });
      if (!professional) {
        throw new Error("Profissional não encontrado");
      }

      const service = await prismaClient.service.findFirst({
        where: { name: dto.serviceName },
      });
      if (!service) {
        throw new Error("Serviço não encontrado");
      }

      const product = await prismaClient.product.findFirst({
        where: { name: dto.productName },
      });
      if (!product) {
        throw new Error("Serviço não encontrado");
      }

        const totalAmount = new Prisma.Decimal(service.price).add(new Prisma.Decimal(product?.price ?? 0));


        const transaction = await prismaClient.financialTransaction.create({
            data: {
              date: new Date(),
              totalAmount: totalAmount,
              paymentMethod: dto.paymentMethod,
              notes: dto.notes,
              clientId: client.id,
              professionalId: professional.id,
              serviceId: service.id,
              productId: product.id
            },
          })
        
        const transactionFull = await prismaClient.financialTransaction.findUnique({
          where: { id: transaction.id },
          include:{
            client: true,
            professional: true,
            services: true,
            products: true
          }
        })

        return transactionFull
    }
}