import { Decimal } from "@prisma/client/runtime/library";

export interface TransitionsDTO {
  totalAmount: string;
  paymentMethod: string;
  notes?: string;
  clientName: string;
  serviceDate: Date;
  professionalName: string;

  services: TransactionServiceDTO[];
  products?: TransactionProductDTO[];
  }

  export interface TransactionServiceDTO {
  name: string;
  price: Decimal;
  quantity: number
}

export interface TransactionProductDTO {
  name: string;
  price: Decimal;
  quantity: number
}
  