import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { DoctorScheduleService } from "./doctorSchedule.service";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await DoctorScheduleService.insertIntoDB(user, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor schedule created successfully!",
    data: result,
  });
});

export const DoctorScheduleController = {
  insertIntoDB,
};
