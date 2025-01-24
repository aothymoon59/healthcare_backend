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

const seedCompanyInfo = async () => {
  try {
    const existingCompanyInfo = await prisma.companyInfo.findFirst();

    if (existingCompanyInfo) {
      console.log("Company information already exists.");
      return;
    }

    // Default data for seeding
    const defaultCompanyInfo = {
      companyName: "E-HealthPro BD",
      nameForHeader:
        "<p>E-Health<span style='color: #1586FD;'>Pro</span> BD</p>",
      companyLogo: "https://placehold.co/150x150",
      address: "123 Default St, Default City, Country",
      email: "info@defaultcompany.com",
      phoneNumber: "123-456-7890",
      telephone: "987-654-3210",
      website: "https://defaultcompany.com",
      facebookUrl: "https://facebook.com/defaultcompany",
      instagramUrl: "https://instagram.com/defaultcompany",
      twitterUrl: "https://twitter.com/defaultcompany",
      linkedinUrl: "https://linkedin.com/company/defaultcompany",
    };

    const createdCompanyInfo = await prisma.companyInfo.create({
      data: defaultCompanyInfo,
    });

    console.log("Company information seeded successfully:", createdCompanyInfo);
  } catch (err) {
    console.error("Error seeding company information:", err);
  } finally {
    await prisma.$disconnect();
  }
};

const seedDatabase = async () => {
  await seedSuperAdmin();
  await seedCompanyInfo();
};

seedDatabase();
