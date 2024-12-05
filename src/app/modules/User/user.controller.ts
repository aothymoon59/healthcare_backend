import { Request, Response } from "express";
import { UserService } from "./user.service";
import { catchAsync } from "../../../shared/catchAsync";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createAdmin(req);

  res.status(200).json({
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});
const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createDoctor(req);

  res.status(200).json({
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});
const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createPatient(req);

  res.status(200).json({
    success: true,
    message: "Patient created successfully",
    data: result,
  });
});

export const UserController = {
  createAdmin,
  createDoctor,
  createPatient,
};
