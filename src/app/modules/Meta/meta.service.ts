import { UserRole } from "@prisma/client";
import { IAuthUser } from "../../interfaces/common";
import prisma from "../../../shared/prisma";

const fetchDashboardMetaData = async (user: IAuthUser) => {
  switch (user?.role) {
    case UserRole.SUPER_ADMIN:
      getSuperAdminMetaData();
      break;
    case UserRole.ADMIN:
      getAdminMetaData();
      break;
    case UserRole.DOCTOR:
      getDoctorMetaData(user as IAuthUser);
      break;
    case UserRole.PATIENT:
      getPatientMetaData();
      break;
    default:
      throw new Error("You are not authorized");
  }
};

const getSuperAdminMetaData = async () => {
  console.log("super admin");
};
const getAdminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
  });
  console.log({
    appointmentCount,
    patientCount,
    doctorCount,
    paymentCount,
    totalRevenue,
  });
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
  });
  //   console.log(doctorData);
  console.log({ appointmentCount, patientCount });
};
const getPatientMetaData = async () => {
  console.log("patient");
};

export const MetaService = {
  fetchDashboardMetaData,
};
