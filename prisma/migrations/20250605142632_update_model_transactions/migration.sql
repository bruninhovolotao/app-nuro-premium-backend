/*
  Warnings:

  - The `totalAmount` column on the `financial_transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "financial_transaction" DROP CONSTRAINT "financial_transaction_productId_fkey";

-- DropForeignKey
ALTER TABLE "financial_transaction" DROP CONSTRAINT "financial_transaction_serviceId_fkey";

-- AlterTable
ALTER TABLE "financial_transaction" DROP COLUMN "totalAmount",
ADD COLUMN     "totalAmount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ALTER COLUMN "serviceId" DROP NOT NULL,
ALTER COLUMN "productId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "service_on_transaction" (
    "id" SERIAL NOT NULL,
    "financialTransactionId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "service_on_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_on_transaction" (
    "id" SERIAL NOT NULL,
    "financialTransactionId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "product_on_transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "financial_transaction" ADD CONSTRAINT "financial_transaction_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_transaction" ADD CONSTRAINT "financial_transaction_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_on_transaction" ADD CONSTRAINT "service_on_transaction_financialTransactionId_fkey" FOREIGN KEY ("financialTransactionId") REFERENCES "financial_transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_on_transaction" ADD CONSTRAINT "service_on_transaction_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_on_transaction" ADD CONSTRAINT "product_on_transaction_financialTransactionId_fkey" FOREIGN KEY ("financialTransactionId") REFERENCES "financial_transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_on_transaction" ADD CONSTRAINT "product_on_transaction_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
