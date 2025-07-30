import { Client } from "@prisma/client";
import { prismaClient } from "../database/prisma.client";
import { clientDTO, ClientListDTO } from "../dto/client.dto";
import { HTTPError } from "../utils/http.error";
import { Decimal } from '@prisma/client/runtime/library';

export interface ClientReportItemDTO {
  id: number;
  dataAtendimento: Date;
  metodoPagamento: string;
  valorTotal: Decimal;
  profissional: string;
  observacoes?: string | null;
  servicos: {
    nome: string;
    quantidade: number;
    valorUnitario: Decimal;
    total: Decimal;
  }[];
  produtos: {
    nome: string;
    quantidade: number;
    valorUnitario: Decimal;
    total: Decimal;
  }[];
}

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
          professional: true,
          serviceItems: {
            include: {
              transaction: {
                include: {
                  serviceItems: true
                }
              },
            },
          },
          productItems: {
            include: {
              transaction: {
                include: {
                  productItems: true,
                }
            },
          },
        },
      }});

      return transactions.map((t) => ({
        id: t.id,
        dataAtendimento: t.date,
        metodoPagamento: t.paymentMethod,
        valorTotal: t.totalAmount,
        profissional: t.professional.name,
        observacoes: t.notes,
        servicos: t.serviceItems.map((s) => ({
          nome: s.name,
          quantidade: s.quantity,
          valorUnitario: s.price,
          total: new Decimal(s.price).mul(s.quantity),
        })),
        produtos: t.productItems.map((p) => ({
          nome: p.name,
          quantidade: p.quantity,
          valorUnitario: p.price,
          total: new Decimal(p.price).mul(p.quantity),
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