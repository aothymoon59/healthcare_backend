-- CreateTable
CREATE TABLE "companyInfo" (
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

    CONSTRAINT "companyInfo_pkey" PRIMARY KEY ("id")
);
