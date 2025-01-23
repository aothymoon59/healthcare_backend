import express, { NextFunction, Request, Response } from "express";
import { MetaController } from "./meta.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import { MetaValidation } from "./meta.validation";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  MetaController.fetchDashboardMetaData
);

router.post(
  "/company-info",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = MetaValidation.createOrUpdateCompanyInfo.parse(
      JSON.parse(req.body.data)
    );
    return MetaController.createOrUpdateCompanyInfo(req, res, next);
  }
);

router.get("/company-info");

export const MetaRoutes = router;
