import { Prisma, Product, ProductSale } from "@prisma/client";
import { prismaClient } from "../database/prisma.client";
import { productListDTO } from "../dto/product.dto";
import { HTTPError } from "../utils/http.error";
import { salesDTO } from "../dto/sales.dto";

export class salesService {
    public async create(dto: salesDTO): Promise<ProductSale>{

        // Buscar o profissional:
        const product = await prismaClient.product.findFirst({
            where: { name: dto.productName }
        });
        if (!product) {
            throw new HTTPError(404, "Produto não encontrado");
        }

        // Buscar o profissional:
        const professional = await prismaClient.professional.findFirst({
            where: { name: dto.professionalName }
        });
        if (!professional) {
            throw new HTTPError(404, "Profissional não encontrado");
        }

        // Pega a taxa de comissão:
        const commissionRate = professional.productCommission || new Prisma.Decimal(0);

        // Cria o registro da venda:
        const productSale = await prismaClient.productSale.create({
            data: {
            date: new Date(),
            quantity: dto.quantity,
            unitPrice: product.price,
            totalPrice: product.price.mul(dto.quantity),
            commissionRate, // 💡 Usando a taxa de comissão do profissional
            productId: product.id,
            professionalId: professional.id,
            }
        });
        return productSale;
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