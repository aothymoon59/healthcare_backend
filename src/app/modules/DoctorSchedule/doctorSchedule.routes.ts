import express from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { validateRequest } from "../../middlewares/validateRequest";
import { DoctorScheduleValidation } from "./doctorSchedule.validation";
import { checkDoctorAuthorization } from "../../middlewares/checkDoctorAuthorization";
const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  DoctorScheduleController.getAllFromDB
);

router.get(
  "/my-schedule",
  auth(UserRole.DOCTOR),
  checkDoctorAuthorization(),
  DoctorScheduleController.getMySchedule
);
router.post(
  "/",
  auth(UserRole.DOCTOR),
  checkDoctorAuthorization(),
  validateRequest(DoctorScheduleValidation.create),
  DoctorScheduleController.insertIntoDB
);
router.delete(
  "/:id",
  auth(UserRole.DOCTOR),
  checkDoctorAuthorization(),
  DoctorScheduleController.deleteFromDB
);

export const DoctorScheduleRoutes = router;
