/*
  Warnings:

  - You are about to drop the column `isAuthorizedDoctor` on the `doctors` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AuthorizationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "isAuthorizedDoctor",
ADD COLUMN     "authorizationStatus" "AuthorizationStatus" NOT NULL DEFAULT 'PENDING';
