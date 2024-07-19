/*
  Warnings:

  - You are about to drop the column `dateDisplay` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "dateDisplay",
ADD COLUMN     "dateEstimate" BOOLEAN NOT NULL DEFAULT false;
