/*
  Warnings:

  - You are about to drop the `companyInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "companyInfo";

-- CreateTable
CREATE TABLE "company_info" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyLogo" TEXT NOT NULL,
    "secondaryLogo" TEXT,
    "address" TEXT,
    "email" TEXT,
    "phoneNumber" TEXT,
    "website" TEXT,
    "facebookUrl" TEXT,
    "instagramUrl" TEXT,
    "twitterUrl" TEXT,
    "linkedinUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_info_pkey" PRIMARY KEY ("id")
);
