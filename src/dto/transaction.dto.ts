import { Decimal } from "@prisma/client/runtime/library";

export interface TransitionsDTO {
  totalAmount: string;
  paymentMethod: string;
  notes?: string;
  unidade: string;
  clientName: string;
  transactionDate: string;

  services: TransactionServiceDTO[];
  products?: TransactionProductDTO[];
  }

  export interface TransactionServiceDTO {
  name: string;
  price: Decimal;
  quantity: number;
  professionalName: string;
}

export interface TransactionProductDTO {
  name: string;
  price: Decimal;
  quantity: number;
  professionalName: string;
}
  