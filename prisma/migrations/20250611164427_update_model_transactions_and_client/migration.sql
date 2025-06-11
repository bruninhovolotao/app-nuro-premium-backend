/*
  Warnings:

  - You are about to drop the column `email` on the `client` table. All the data in the column will be lost.
  - Added the required column `serviceDate` to the `financial_transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "client" DROP COLUMN "email";

-- AlterTable
ALTER TABLE "financial_transaction" ADD COLUMN     "serviceDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "professional" ADD COLUMN     "productCommission" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "serviceCommission" DECIMAL(5,2) NOT NULL DEFAULT 0.00;
