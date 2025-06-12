/*
  Warnings:

  - You are about to drop the column `productId` on the `product_sale` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "product_sale" DROP CONSTRAINT "product_sale_productId_fkey";

-- AlterTable
ALTER TABLE "product_sale" DROP COLUMN "productId";
