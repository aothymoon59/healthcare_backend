import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { UserRole } from "@prisma/client";
import { auth } from "../../middlewares/auth";
import { fileUploader } from "../../../helpers/fileUploader";
import { userValidation } from "./user.validation";

const router = express.Router();

router.post(
  "/create-admin",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data));
    return UserController.createAdmin(req, res, next);
  }
);
router.post(
  "/create-doctor",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createDoctor.parse(JSON.parse(req.body.data));
    return UserController.createDoctor(req, res, next);
  }
);
router.post(
  "/create-patient",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createPatient.parse(JSON.parse(req.body.data));
    return UserController.createPatient(req, res, next);
  }
);

export const UserRoutes = router;
