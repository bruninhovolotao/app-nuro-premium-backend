import { Prisma, Professional, Service } from "@prisma/client";
import { prismaClient } from "../database/prisma.client";
import { professionalDTO, professionalListDTO } from "../dto/professional.dto";
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
}