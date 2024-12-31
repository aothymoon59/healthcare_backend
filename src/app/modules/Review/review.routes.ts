import express from "express";
import { ReviewController } from "./review.controller";
import { UserRole } from "@prisma/client";
import { validateRequest } from "../../middlewares/validateRequest";
import { ReviewValidation } from "./review.validation";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.PATIENT),
  validateRequest(ReviewValidation.create),
  ReviewController.insertIntoDB
);

export const ReviewRoutes = router;
