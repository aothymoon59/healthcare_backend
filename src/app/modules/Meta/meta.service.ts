import { PaymentStatus, UserRole } from "@prisma/client";
import { IAuthUser } from "../../interfaces/common";
import prisma from "../../../shared/prisma";
import { Request } from "express";
import { IFile } from "../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";

const createOrUpdateCompanyInfo = async (req: Request) => {
  const file = req.file as IFile; // Primary logo

  // Fetch the single company info record (if it exists)
  const existingCompanyInfo = await prisma.companyInfo.findFirst();

  // Process and upload the primary logo
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.companyLogo = uploadToCloudinary?.secure_url;
  }

  let result;
  if (existingCompanyInfo) {
    // Update the existing record
    result = await prisma.companyInfo.update({
      where: { id: existingCompanyInfo.id }, // Use the primary key for updating
      data: req.body,
    });
  } else {
    // Create a new record (since none exists)
    result = await prisma.companyInfo.create({
      data: req.body,
    });
  }

  return result;
};

const getCompanyInfo = async () => {
  const result = await prisma.companyInfo.findFirst();
  return result;
};

const fetchDashboardMetaData = async (user: IAuthUser) => {
  let metaData;
  switch (user?.role) {
    case UserRole.SUPER_ADMIN:
      metaData = getSuperAdminMetaData();
      break;
    case UserRole.ADMIN:
      metaData = getAdminMetaData();
      break;
    case UserRole.DOCTOR:
      metaData = getDoctorMetaData(user as IAuthUser);
      break;
    case UserRole.PATIENT:
      metaData = getPatientMetaData(user as IAuthUser);
      break;
    default:
      throw new Error("You are not authorized");
  }

  return metaData;
};

const getSuperAdminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const adminCount = await prisma.admin.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.findMany({
    where: {
      status: PaymentStatus.PAID,
    },
  });

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: PaymentStatus.PAID,
    },
  });

  const barChartData = await getBarChartData();
  const pieChartData = await getPieChartData();

  return {
    appointmentCount,
    adminCount,
    patientCount,
    doctorCount,
    paymentCount: paymentCount.length,
    totalRevenue: totalRevenue._sum.amount,
    barChartData,
    pieChartData,
  };
};
const getAdminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.findMany({
    where: {
      status: PaymentStatus.PAID,
    },
  });

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: PaymentStatus.PAID,
    },
  });

  const barChartData = await getBarChartData();
  const pieChartData = await getPieChartData();

  return {
    appointmentCount,
    patientCount,
    doctorCount,
    paymentCount: paymentCount.length,
    totalRevenue: totalRevenue._sum.amount,
    barChartData,
    pieChartData,
  };
};
const getDoctorMetaData = async (user: IAuthUser) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const patientCount = await prisma.appointment.groupBy({
    by: ["patientId"],
    _count: {
      id: true,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      appointment: {
        doctorId: doctorData.id,
      },
    },
  });

  const appointStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
    where: {
      doctorId: doctorData.id,
    },
  });

  const formattedAppointStatusDistribution = appointStatusDistribution.map(
    ({ status, _count }) => {
      return {
        status,
        count: Number(_count.id),
      };
    }
  );

  return {
    appointmentCount,
    patientCount: patientCount.length,
    reviewCount,
    totalRevenue: totalRevenue._sum.amount,
    appointStatusDistribution: formattedAppointStatusDistribution,
  };
};
const getPatientMetaData = async (user: IAuthUser) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      patientId: patientData.id,
    },
  });

  const prescriptionCount = await prisma.prescription.count({
    where: {
      patientId: patientData.id,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      patientId: patientData.id,
    },
  });

  const appointStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
    where: {
      patientId: patientData.id,
    },
  });

  const formattedAppointStatusDistribution = appointStatusDistribution.map(
    ({ status, _count }) => {
      return {
        status,
        count: Number(_count.id),
      };
    }
  );

  return {
    appointmentCount,
    prescriptionCount,
    reviewCount,
    appointStatusDistribution: formattedAppointStatusDistribution,
  };
};

const getBarChartData = async () => {
  const appointmentCountByMonth: { month: Date; count: bigint }[] =
    await prisma.$queryRaw`
    SELECT DATE_TRUNC('month', "createdAt") AS month, 
    CAST(COUNT(*) AS INTEGER) AS count
    FROM "appointments" 
    GROUP BY month 
    ORDER BY month ASC
    `;

  return appointmentCountByMonth;
};

const getPieChartData = async () => {
  const appointStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
  });

  const formattedAppointStatusDistribution = appointStatusDistribution.map(
    ({ status, _count }) => {
      return {
        status,
        count: Number(_count.id),
      };
    }
  );

  return formattedAppointStatusDistribution;
};

export const MetaService = {
  fetchDashboardMetaData,
  createOrUpdateCompanyInfo,
  getCompanyInfo,
};
