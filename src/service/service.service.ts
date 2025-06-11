import { Service } from "@prisma/client";
import { prismaClient } from "../database/prisma.client";
import { serviceDTO, serviceListDTO } from "../dto/service.dto";
import { Decimal } from "@prisma/client/runtime/library";

export class serviceService {
    public async create(dto: serviceDTO): Promise<Service>{

        const existingService = await prismaClient.client.findFirst({
            where: {
                name: dto.name
            }
        })

        if(existingService){
            throw new Error("Serviço já cadastrado");
        }

        const priceDecimal = new Decimal(dto.price);

        const newService = await prismaClient.service.create({
            data:{
                name: dto.name,
                price: priceDecimal
            }
        })

        return newService;
    }

    public async list(): Promise<serviceListDTO[]> {

        const services = await prismaClient.service.findMany({
            select: {
              id: true,
              name: true,
              price: true,
            },
          });
          return services;
    }
}