import { Professional, Service } from "@prisma/client";
import { prismaClient } from "../database/prisma.client";
import { professionalDTO } from "../dto/professional.dto";

export class professionalService {
    public async create(dto: professionalDTO): Promise<Professional>{

        const newProfessional = await prismaClient.professional.create({
            data:{
                name: dto.name,
            }
        })

        return newProfessional;
    }
}