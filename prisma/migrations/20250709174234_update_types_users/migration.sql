/*
  Warnings:

  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Tipo" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role",
ADD COLUMN     "tipo" "Tipo" NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "Role";
