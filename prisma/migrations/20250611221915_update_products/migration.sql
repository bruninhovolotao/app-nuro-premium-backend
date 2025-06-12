/*
  Warnings:

  - Added the required column `productId` to the `product_sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_sale" ADD COLUMN     "productId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "product_sale" ADD CONSTRAINT "product_sale_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
