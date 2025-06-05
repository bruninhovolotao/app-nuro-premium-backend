import { Product } from "@prisma/client";
import { prismaClient } from "../database/prisma.client";
import { productDTO } from "../dto/product.dto";
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

        const priceDecimal = new Decimal(dto.price);

        const newProduct = await prismaClient.product.create({
            data:{
                name: dto.name,
                price: priceDecimal
            }
        })

        return newProduct;
    }
}