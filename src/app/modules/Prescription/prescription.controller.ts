import { Request, Response } from "express";
import { PrescriptionService } from "./prescription.service";
import { IAuthUser } from "../../interfaces/common";
import { sendResponse } from "../../../shared/sendResponse";
import { catchAsync } from "../../../shared/catchAsync";
import { StatusCodes } from "http-status-codes";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await PrescriptionService.insertIntoDB(
      user as IAuthUser,
      req.body
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Prescription created successfully",
      data: result,
    });
  }
);

export const PrescriptionController = {
  insertIntoDB,
};
