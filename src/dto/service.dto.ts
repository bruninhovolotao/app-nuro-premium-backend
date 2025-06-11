import { Decimal } from "@prisma/client/runtime/library";

export interface serviceDTO{
    name: string;
    price: string;
}

export interface serviceListDTO{
    name: string;
    price: Decimal;
}