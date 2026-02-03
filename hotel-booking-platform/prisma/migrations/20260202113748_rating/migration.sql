/*
  Warnings:

  - You are about to alter the column `rating` on the `hotels` table. The data in that column could be lost. The data in that column will be cast from `Decimal(2,1)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "hotels" ALTER COLUMN "rating" SET DATA TYPE DOUBLE PRECISION;
