import { Prisma, Professional } from "@prisma/client";
import { prismaClient } from "../database/prisma.client";
import { professionalDTO, professionalListDTO, ProfessionalReport } from "../dto/professional.dto";
import { HTTPError } from "../utils/http.error";

export class professionalService {
    public async create(dto: professionalDTO): Promise<Professional>{

        // Verifica se o profissional já existe
        const existingProfessional = await prismaClient.professional.findFirst({
            where: { name: dto.name },
        });
        if (existingProfessional) {
            throw new HTTPError(400, "Profissional já cadastrado");
        }

        const newProfessional = await prismaClient.professional.create({
            data:{
                name: dto.name,
                productCommission: new Prisma.Decimal(dto.productCommission || 0),
                serviceCommission: new Prisma.Decimal(dto.serviceCommission || 0),
            }
        })

        return newProfessional;
    }
    public async list(): Promise<professionalListDTO[]> {
        
        const services = await prismaClient.professional.findMany({
            select: {
                id: true,
                name: true,
                serviceCommission: true,
                productCommission: true, 
            },
            });
            return services;
    }
    public async professionalReport(professionalId: number, unidade: string, startDate?: string, endDate?: string) {
        const dateFilter = startDate && endDate ? {
          date: {
            gte: new Date(`${startDate}T00:00:00.000Z`),
            lte: new Date(`${endDate}T23:59:59.999Z`)
          }
        } : {};
      
        // Busca o profissional
        const professional = await prismaClient.professional.findUnique({
          where: { id: professionalId },
        });
      
        if (!professional) {
          throw new Error('Profissional não encontrado');
        }
      
        // Busca todas as transações de serviços financeiras no período
        const transactions = await prismaClient.financialTransaction.findMany({
          where: {
            unidade,
            ...dateFilter,
            OR: [
                  { serviceItems: { some: { professionalId } } },
                  { productItems: { some: { professionalId } } }
                ]
          },
          include: {
                serviceItems: true,
                productItems: true
          }
        });
      
        // Agrupamento e cálculos
        let totalServices = 0;
        let totalServiceValue = 0;
        let totalProducts = 0;
        let totalProductValue = 0;
      
        // Percorre todas as transações e soma os itens do profissional
        for (const transaction of transactions) {
          // Serviços
          const serviceItems = transaction.serviceItems.filter(s => s.professionalId === professionalId);
          for (const s of serviceItems) {
            const price = Number(s.price) || 0;
            const qty = s.quantity || 1;
            totalServices += qty;
            totalServiceValue += qty * price;
          }

          // Produtos
          const productItems = transaction.productItems.filter(p => p.professionalId === professionalId);
          for (const p of productItems) {
            const price = Number(p.price) || 0;
            const qty = p.quantity || 1;
            totalProducts += qty;
            totalProductValue += qty * price;
          }
        }
      
        const commissionRateService = Number(professional.serviceCommission) / 100;
        const commissionServiceValue = totalServiceValue * commissionRateService;
        const valueToReceiveServices = commissionServiceValue;
      
        const commissionRateProduct = Number(professional.productCommission) / 100;
        const commissionProductValue = totalProductValue * commissionRateProduct;
        const valueToReceiveProduct = commissionProductValue;

        const valueToReceiveTotal = valueToReceiveServices + valueToReceiveProduct;
      
        return {
          professional: {
            id: professional.id,
            name: professional.name,
          },
          unidade: unidade,
          periodo: {
            start: startDate || null,
            end: endDate || null,
          },
          serviceItems: {
            QuantityService: totalServices,
          },
          productItems: {
            QuantityProduct: totalProducts,
          },
          total: {
            service: {
              total: totalServiceValue,
              commission: professional.serviceCommission,
              toReceive: valueToReceiveServices,
            },
            product: {
              total: totalProductValue,
              commission: professional.productCommission,
              toReceive: valueToReceiveProduct,
            },
            totalReceive: valueToReceiveTotal
          },
          
        };
    }
    public async professionalInvoicing(professionalId: number, startDate?: string, endDate?: string) {
        const dateFilter = startDate && endDate ? {
          date: {
            gte: new Date(`${startDate}T00:00:00.000Z`),
            lte: new Date(`${endDate}T23:59:59.999Z`)
          }
        } : {};
      
        // Busca o profissional
        const professional = await prismaClient.professional.findUnique({
          where: { id: professionalId },
          
        });
      
        if (!professional) {
          throw new Error('Profissional não encontrado');
        }
      
        const transactions = await prismaClient.financialTransaction.findMany({
          where: {
            ...dateFilter,
            OR: [
                  { serviceItems: { some: { professionalId } } },
                  { productItems: { some: { professionalId } } }
                ]
          },
          select:{
            client: {
              select:{ name: true }
            },
            date: true,
            serviceItems: {
              where:{ professionalId },
              select:{
                name: true,
                price: true,
                quantity: true
              }
            },
            productItems: {
              where:{ professionalId },
              select:{
                name: true,
                price: true,
                quantity: true
              }
            },
          },
          orderBy: {date: "desc"}
        });

        if (transactions.length === 0) {
            throw new Error("Nenhum registro encontrado para o período selecionado.");
        }

        // Agrupamento e cálculos
        let totalServices = 0;
        let totalServiceValue = 0;
        let totalProducts = 0;
        let totalProductValue = 0;
      
        // Percorre todas as transações e soma os itens do profissional
        for (const transaction of transactions) {
          // Serviços
          const serviceItems = transaction.serviceItems.filter(s => (professional.id));
          for (const s of serviceItems) {
            const price = Number(s.price) || 0;
            const qty = s.quantity || 1;
            totalServices += qty;
            totalServiceValue += qty * price;
          }

          // Produtos
          const productItems = transaction.productItems.filter(p => (professional.id));
          for (const p of productItems) {
            const price = Number(p.price) || 0;
            const qty = p.quantity || 1;
            totalProducts += qty;
            totalProductValue += qty * price;
          }
        }

        return {
          quantidadeRegistros: transactions.length,
          professional: {
            id: professional.id,
            name: professional.name,
          },
          periodo: {
            start: startDate || null,
            end: endDate || null,
          },
          transactions,
          totalServiceValue,
          totalProductValue,
        };
    }
    public async update(id: number, data: professionalDTO) {      
      const professionalExists = await prismaClient.professional.findUnique({
        where: { id }
      });
  
      if (!professionalExists) {
        throw new HTTPError(404, "Profissional não encontrado.");
      }
      const updatedProfessional = await prismaClient.professional.update({
        where: { id },
        data: {
          name: data.name ?? professionalExists.name,
          serviceCommission: data.serviceCommission ?? professionalExists.serviceCommission,
          productCommission: data.productCommission ?? professionalExists.productCommission
        }
      });
  
      return updatedProfessional;
    }
    public async delete(id: number) {
      
      const professionalExists = await prismaClient.professional.findUnique({
        where: { id }
      });
    
      if (!professionalExists) {
        throw new HTTPError(404, "Profissional não encontrado.");
      }

      await prismaClient.serviceItem.findMany({
        where: { professionalId: id },
        select: { id: true }
      });

      await prismaClient.productItem.findMany({
        where: { professionalId: id },
        select: { id: true }
      });

      await prismaClient.serviceItem.deleteMany({
        where: { professionalId: id }
      });

      await prismaClient.productItem.deleteMany({
        where: { professionalId: id }
      })

      await prismaClient.professional.delete({
        where: { id: id }
      })

    }
    
}