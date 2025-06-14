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
export interface ProfessionalReport {
    professional: {
      id: number;
      name: string;
    };
    periodo: {
      start: string | null;
      end: string | null;
    };
    service: {
      QuantityService: number;
      services: {
        name: string;
        price: Decimal;
      }[];
      serviceCommission: Decimal;
    };
    product: {
      QuantityProduct: number;
      products: {
        name: string;
        price: Decimal;
      }[];
      productCommission: Decimal;
    };
    total: {
      service: {
        total: number;
        CommissionRateService: number;
        commission: number;
      };
      product: {
        total: number;
        CommissionRateProduct: number;
        commission: number;
      };
    };
  }
  
