import { Client } from "@prisma/client";
import { prismaClient } from "../database/prisma.client";
import { clientDTO } from "../dto/client.dto";
import { HTTPError } from "../utils/http.error";

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
            name: data.name ?? clientExists.name,
            phone: data.phone ?? clientExists.phone,
            email: data.email ?? clientExists.email
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