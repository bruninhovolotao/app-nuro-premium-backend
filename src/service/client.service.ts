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