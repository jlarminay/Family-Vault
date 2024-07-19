/*
  Warnings:

  - You are about to drop the column `fileId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[path]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_itemId_fkey";

-- DropIndex
DROP INDEX "Item_fileId_key";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "fileId",
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "path" TEXT NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL;

-- DropTable
DROP TABLE "File";

-- CreateIndex
CREATE UNIQUE INDEX "Item_path_key" ON "Item"("path");
