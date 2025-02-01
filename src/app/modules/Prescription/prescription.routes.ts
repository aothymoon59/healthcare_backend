import express from "express";
import { PrescriptionController } from "./prescription.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { validateRequest } from "../../middlewares/validateRequest";
import { PrescriptionValidation } from "./prescription.validation";
import { checkDoctorAuthorization } from "../../middlewares/checkDoctorAuthorization";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  PrescriptionController.getAllFromDB
);

router.get(
  "/my-prescription",
  auth(UserRole.PATIENT, UserRole.DOCTOR),
  checkDoctorAuthorization(),
  PrescriptionController.patientPrescription
);
router.get(
  "/:id",
  auth(UserRole.PATIENT, UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  checkDoctorAuthorization(),
  PrescriptionController.getPrescriptionById
);

router.post(
  "/",
  auth(UserRole.DOCTOR),
  checkDoctorAuthorization(),
  validateRequest(PrescriptionValidation.create),
  PrescriptionController.insertIntoDB
);

export const PrescriptionRoutes = router;
