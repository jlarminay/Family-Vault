/*
  Warnings:

  - You are about to drop the column `views` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "views",
ADD COLUMN     "view" INTEGER NOT NULL DEFAULT 0;
