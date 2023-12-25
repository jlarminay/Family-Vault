/*
  Warnings:

  - Added the required column `resolution` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "resolution" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL;
