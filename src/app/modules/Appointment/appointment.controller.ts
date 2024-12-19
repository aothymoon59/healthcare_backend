import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../../shared/sendResponse";
import { catchAsync } from "../../../shared/catchAsync";
import { AppointmentServices } from "./appointment.service";
import { Request, Response } from "express";
import { IAuthUser } from "../../interfaces/common";

const createAppointment = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await AppointmentServices.createAppointment(
      user as IAuthUser,
      req.body
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Appointment booked successfully!",
      data: result,
    });
  }
);

export const AppointmentController = {
  createAppointment,
};
