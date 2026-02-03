/*
  Warnings:

  - You are about to alter the column `rating` on the `hotels` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(2,1)`.

*/
-- AlterTable
ALTER TABLE "hotels" ALTER COLUMN "rating" SET DATA TYPE DECIMAL(2,1);
