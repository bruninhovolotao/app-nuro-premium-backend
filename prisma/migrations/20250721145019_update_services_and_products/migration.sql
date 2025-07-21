/*
  Warnings:

  - Added the required column `quantity` to the `product_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `service_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_item" ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "service_item" ADD COLUMN     "quantity" INTEGER NOT NULL;
