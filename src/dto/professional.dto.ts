import { Decimal } from "@prisma/client/runtime/library";

export interface professionalDTO{
    name: string;
    productCommission: number,
    serviceCommission: number
}

export interface professionalListDTO{
    name: string;
    productCommission: Decimal,
    serviceCommission: Decimal
}