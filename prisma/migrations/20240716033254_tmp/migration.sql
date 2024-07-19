/*
  Warnings:

  - You are about to drop the column `dateOrder` on the `Item` table. All the data in the column will be lost.
  - Added the required column `dateTaken` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "dateOrder",
ADD COLUMN     "dateTaken" DATE NOT NULL;
