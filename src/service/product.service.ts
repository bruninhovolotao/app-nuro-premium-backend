import { Prisma, Product } from "@prisma/client";
import { prismaClient } from "../database/prisma.client";
import { productDTO, productListDTO } from "../dto/product.dto";
import { Decimal } from "@prisma/client/runtime/library";

export class productService {
    public async create(dto: productDTO): Promise<Product>{

        const existingProduct = await prismaClient.product.findFirst({
            where: {
                name: dto.name
            }
        })

        if(existingProduct){
            throw new Error("Serviço já cadastrado");
        }

        // const priceDecimal = new Decimal(dto.price);
        const priceDecimal = new Prisma.Decimal(dto.price);

        const newProduct = await prismaClient.product.create({
            data:{
                name: dto.name,
                price: dto.price
            }
        })

        return newProduct;
    }

    public async list(): Promise<productListDTO[]> {
    
            const services = await prismaClient.product.findMany({
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              });
              return services;
    }
}