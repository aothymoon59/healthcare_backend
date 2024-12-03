import express from "express";
import { UserController } from "./user.controller";
import { UserRole } from "@prisma/client";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  UserController.createAdmin
);

export const UserRoutes = router;
