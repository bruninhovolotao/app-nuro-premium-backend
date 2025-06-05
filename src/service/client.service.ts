import { Client } from "@prisma/client";
import { prismaClient } from "../database/prisma.client";
import { clientDTO } from "../dto/client.dto";

export class clientService {
    public async create(dto: clientDTO): Promise<Client>{

        const newClient = await prismaClient.client.create({
            data:{
                name: dto.name,
                email: dto.email,
                phone: dto.phone
            }
        })

        return newClient;
    }
}