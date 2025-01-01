import bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";
import prisma from "./shared/prisma";
import config from "./config";

const seedSuperAdmin = async () => {
  try {
    const isExistSuperAdmin = await prisma.user.findFirst({
      where: {
        role: UserRole.SUPER_ADMIN,
      },
    });

    if (isExistSuperAdmin) {
      console.log("super admin already exist");
      return;
    }

    const hashedPassword: string = await bcrypt.hash(
      config.super_admin.password as string,
      12
    );

    const superAdminData = await prisma.user.create({
      data: {
        email: config.super_admin.email as string,
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        admin: {
          create: {
            name: "Super Admin",
            // email: "super@admin.com",
            contactNumber: "1234567890",
          },
        },
      },
    });

    console.log("Super Admin Created Successfully", superAdminData);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
};

seedSuperAdmin();
