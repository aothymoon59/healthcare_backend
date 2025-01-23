import express from "express";
import { MetaController } from "./meta.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  MetaController.fetchDashboardMetaData
);

router.post(
  "/company-info",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  MetaController.createCompanyInfo
);

export const MetaRoutes = router;
