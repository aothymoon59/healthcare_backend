import { Request, Response } from "express";
import { sendResponse } from "../../../shared/sendResponse";
import { catchAsync } from "../../../shared/catchAsync";
import { StatusCodes } from "http-status-codes";
import { MetaService } from "./meta.service";
import { IAuthUser } from "../../interfaces/common";

const fetchDashboardMetaData = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await MetaService.fetchDashboardMetaData(user as IAuthUser);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Meta data retrieval successfully",
      data: result,
    });
  }
);

const createOrUpdateCompanyInfo = catchAsync(
  async (req: Request, res: Response) => {
    const result = await MetaService.createOrUpdateCompanyInfo(req);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Company info added successfully",
      data: result,
    });
  }
);

const getCompanyInfo = catchAsync(async (req: Request, res: Response) => {
  const result = await MetaService.getCompanyInfo();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Company info retrieval successfully",
    data: result,
  });
});

export const MetaController = {
  fetchDashboardMetaData,
  createOrUpdateCompanyInfo,
  getCompanyInfo,
};
