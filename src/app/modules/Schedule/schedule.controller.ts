import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { ScheduleService } from "./schedule.service";
import { IAuthUser } from "../../interfaces/common";
import { pick } from "../../../shared/pick";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.insertIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Schedule created successfully!",
    data: result,
  });
});

const getAllFromDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const filters = pick(req.query, ["startDateTime", "endDateTime"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await ScheduleService.getAllFromDB(filters, options);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Schedule fetched successfully!",
      data: result,
    });
  }
);

export const ScheduleController = {
  insertIntoDB,
  getAllFromDB,
};
