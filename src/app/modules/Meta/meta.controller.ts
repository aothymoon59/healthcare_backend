import { Request, Response } from "express";
import { sendResponse } from "../../../shared/sendResponse";
import { catchAsync } from "../../../shared/catchAsync";
import { StatusCodes } from "http-status-codes";
import { MetaService } from "./meta.service";

const fetchDashboardMetaData = catchAsync(
  async (req: Request, res: Response) => {
    const result = await MetaService.fetchDashboardMetaData();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Meta data retrieval successfully",
      data: result,
    });
  }
);

export const MetaController = {
  fetchDashboardMetaData,
};
