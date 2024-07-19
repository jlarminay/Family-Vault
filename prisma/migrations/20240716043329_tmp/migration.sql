/*
  Warnings:

  - You are about to drop the column `dateTaken` on the `Item` table. All the data in the column will be lost.
  - Added the required column `takenAt` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "dateTaken",
ADD COLUMN     "takenAt" DATE NOT NULL;
