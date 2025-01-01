import { UserRole } from "@prisma/client";
import { IAuthUser } from "../../interfaces/common";

const fetchDashboardMetaData = async (user: IAuthUser) => {
  switch (user?.role) {
    case UserRole.SUPER_ADMIN:
      getSuperAdminMetaData();
      break;
    case UserRole.ADMIN:
      getAdminMetaData();
      break;
    case UserRole.DOCTOR:
      getDoctorMetaData();
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
  console.log("admin");
};
const getDoctorMetaData = async () => {
  console.log("doctor");
};
const getPatientMetaData = async () => {
  console.log("patient");
};

export const MetaService = {
  fetchDashboardMetaData,
};
