/*
  Warnings:

  - You are about to drop the column `productName` on the `financial_transaction` table. All the data in the column will be lost.
  - You are about to drop the column `productPrice` on the `financial_transaction` table. All the data in the column will be lost.
  - You are about to drop the column `serviceDate` on the `financial_transaction` table. All the data in the column will be lost.
  - You are about to drop the column `serviceName` on the `financial_transaction` table. All the data in the column will be lost.
  - You are about to drop the column `servicePrice` on the `financial_transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "financial_transaction" DROP COLUMN "productName",
DROP COLUMN "productPrice",
DROP COLUMN "serviceDate",
DROP COLUMN "serviceName",
DROP COLUMN "servicePrice";

-- CreateTable
CREATE TABLE "service_item" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "transactionId" INTEGER NOT NULL,

    CONSTRAINT "service_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_item" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "transactionId" INTEGER NOT NULL,

    CONSTRAINT "product_item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "service_item" ADD CONSTRAINT "service_item_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "financial_transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_item" ADD CONSTRAINT "product_item_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "financial_transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
