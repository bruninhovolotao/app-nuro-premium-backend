import { Client } from "@prisma/client";
import { prismaClient } from "../database/prisma.client";
import { clientDTO, ClientListDTO } from "../dto/client.dto";
import { HTTPError } from "../utils/http.error";

export class clientService {
    public async create(dto: clientDTO): Promise<Client>{

        const newClient = await prismaClient.client.create({
            data:{
                name: dto.name,
            }
        })

        return newClient;
    }

    public async list(): Promise<ClientListDTO[]> {
      const clients = await prismaClient.client.findMany({
        select: {
          id: true,
          name: true,
        },
      });
      return clients;
    }

    public async ClientReport(clientId: number, startDate?: string, endDate?: string) {
      const whereClause: any = {
        clientId,
      };

      if (startDate && endDate) {
        whereClause.serviceDate = {
          gte: new Date(startDate),
          lte: new Date(endDate),
        };
      }

      const transactions = await prismaClient.financialTransaction.findMany({
        where: whereClause,
        orderBy: {
          serviceDate: "desc",
        },
        include: {
          client: true,
          professional: true,
          services: {
            include: {
              service: true,
            },
          },
          products: {
            include: {
              product: true,
            },
          },
        },
      });

      return transactions.map((t) => ({
        id: t.id,
        dataAtendimento: t.serviceDate,
        metodoPagamento: t.paymentMethod,
        valorTotal: t.totalAmount,
        profissional: t.professional.name,
        observacoes: t.notes,
        servicos: t.services.map((s) => ({
          nome: s.service.name,
          quantidade: s.quantity,
          valorUnitario: s.service.price,
          total: s.service.price.mul(s.quantity),
        })),
        produtos: t.products.map((p) => ({
          nome: p.product.name,
          quantidade: p.quantity,
          valorUnitario: p.product.price,
          total: p.product.price.mul(p.quantity),
        })),
      }));
    }

    public async update(id: number, data: clientDTO) {
        
        const clientExists = await prismaClient.client.findUnique({
          where: { id }
        });
    
        if (!clientExists) {
          throw new HTTPError(404, "Cliente não encontrado.");
        }
    
        
        const updatedClient = await prismaClient.client.update({
          where: { id },
          data: {
            name: data.name ?? clientExists.name
          }
        });
    
        return updatedClient;
    }

    public async delete(id: number) {
      const clientExists = await prismaClient.client.findUnique({
        where: { id }
      })

      if(!clientExists){
        throw new HTTPError(404, "Cliente não encontrado");
      }

      await prismaClient.client.delete({
        where: { id }
      })

    }
}