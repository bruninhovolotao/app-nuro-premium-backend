import { Decimal } from "@prisma/client/runtime/library";

export interface productDTO{
    name: string;
    price: string;
}

export interface productListDTO{
    name: string;
    price: Decimal;
}