import { Prisma, Professional, Service } from "@prisma/client";
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

    public async professionalReport(professionalId: number, startDate?: string, endDate?: string): Promise<ProfessionalReport> {
        const dateFilter = startDate && endDate ? {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          }
        } : {};
      
        // Busca o profissional
        const professional = await prismaClient.professional.findUnique({
          where: { id: professionalId },
        });
      
        if (!professional) {
          throw new Error('Profissional não encontrado');
        }
      
        // Busca todas as transações financeiras no período
        const transactions = await prismaClient.financialTransaction.findMany({
          where: {
            professionalId,
            ...dateFilter,
          },
          include: {
            services: {
              include: { service: true }
            },
            products: {
              include: { product: true }
            }
          }
        });
      
        // Agrupamento e cálculos
        let totalServices = 0;
        let totalServiceValue = 0;
        let totalProducts = 0;
        let totalProductValue = 0;
      
        transactions.forEach((transaction) => {
          transaction.services.forEach((s) => {
            const price = Number(s.service.price) || 0;
            totalServices += s.quantity;
            totalServiceValue += s.quantity * price;
          });
      
          transaction.products.forEach((p) => {
            const price = Number(p.product.price) || 0;
            totalProducts += p.quantity;
            totalProductValue += p.quantity * price;
          });
        });
      
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
          periodo: {
            start: startDate || null,
            end: endDate || null,
          },
          service: {
            QuantityService: totalServices,
          },
          product: {
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
      

}