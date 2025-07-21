/*
  Warnings:

  - You are about to drop the column `productId` on the `financial_transaction` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `financial_transaction` table. All the data in the column will be lost.
  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_on_transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_sale` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_on_transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "financial_transaction" DROP CONSTRAINT "financial_transaction_productId_fkey";

-- DropForeignKey
ALTER TABLE "financial_transaction" DROP CONSTRAINT "financial_transaction_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "product_on_transaction" DROP CONSTRAINT "product_on_transaction_financialTransactionId_fkey";

-- DropForeignKey
ALTER TABLE "product_on_transaction" DROP CONSTRAINT "product_on_transaction_productId_fkey";

-- DropForeignKey
ALTER TABLE "product_sale" DROP CONSTRAINT "product_sale_productId_fkey";

-- DropForeignKey
ALTER TABLE "product_sale" DROP CONSTRAINT "product_sale_professionalId_fkey";

-- DropForeignKey
ALTER TABLE "service_on_transaction" DROP CONSTRAINT "service_on_transaction_financialTransactionId_fkey";

-- DropForeignKey
ALTER TABLE "service_on_transaction" DROP CONSTRAINT "service_on_transaction_serviceId_fkey";

-- AlterTable
ALTER TABLE "financial_transaction" DROP COLUMN "productId",
DROP COLUMN "serviceId";

-- DropTable
DROP TABLE "product";

-- DropTable
DROP TABLE "product_on_transaction";

-- DropTable
DROP TABLE "product_sale";

-- DropTable
DROP TABLE "service";

-- DropTable
DROP TABLE "service_on_transaction";
