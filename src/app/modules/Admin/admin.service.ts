import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getAllFromDB = async (params: any) => {
  const andConditions: Prisma.AdminWhereInput[] = [];

  const adminSearchableFields = ["name", "email"];

  if (params.searchTerm) {
    andConditions.push({
      OR: adminSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };

  const result = await prisma.admin.findMany({
    where: whereConditions,
  });

  return result;
};

export const AdminService = { getAllFromDB };
