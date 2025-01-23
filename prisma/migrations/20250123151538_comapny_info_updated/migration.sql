/*
  Warnings:

  - Added the required column `nameForHeader` to the `company_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "company_info" ADD COLUMN     "nameForHeader" TEXT NOT NULL;
