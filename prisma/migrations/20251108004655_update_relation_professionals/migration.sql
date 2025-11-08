/*
  Warnings:

  - You are about to drop the column `professionalId` on the `financial_transaction` table. All the data in the column will be lost.
  - You are about to drop the `product_item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_item` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "financial_transaction" DROP CONSTRAINT "financial_transaction_professionalId_fkey";

-- DropForeignKey
ALTER TABLE "product_item" DROP CONSTRAINT "product_item_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "service_item" DROP CONSTRAINT "service_item_transactionId_fkey";

-- AlterTable
ALTER TABLE "financial_transaction" DROP COLUMN "professionalId";

-- DropTable
DROP TABLE "product_item";

-- DropTable
DROP TABLE "service_item";

-- CreateTable
CREATE TABLE "ServiceItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "professionalId" INTEGER NOT NULL,
    "financialTransactionId" INTEGER NOT NULL,

    CONSTRAINT "ServiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "professionalId" INTEGER NOT NULL,
    "financialTransactionId" INTEGER NOT NULL,

    CONSTRAINT "ProductItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ServiceItem" ADD CONSTRAINT "ServiceItem_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceItem" ADD CONSTRAINT "ServiceItem_financialTransactionId_fkey" FOREIGN KEY ("financialTransactionId") REFERENCES "financial_transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductItem" ADD CONSTRAINT "ProductItem_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductItem" ADD CONSTRAINT "ProductItem_financialTransactionId_fkey" FOREIGN KEY ("financialTransactionId") REFERENCES "financial_transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
