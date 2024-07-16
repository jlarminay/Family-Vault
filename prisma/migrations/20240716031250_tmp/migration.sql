/*
  Warnings:

  - A unique constraint covering the columns `[itemId]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fileId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "fileId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "File_itemId_key" ON "File"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "Item_fileId_key" ON "Item"("fileId");
