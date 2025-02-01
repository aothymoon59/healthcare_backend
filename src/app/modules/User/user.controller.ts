import { Request, RequestHandler, Response } from "express";
import { UserService } from "./user.service";
import { catchAsync } from "../../../shared/catchAsync";
import { pick } from "../../../shared/pick";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../../shared/sendResponse";
import { userFilterableFields } from "./user.constant";
import { IAuthUser } from "../../interfaces/common";

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

const createDoctorByAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createDoctorByAdmin(req);

  res.status(200).json({
    success: true,
    message: "Doctor created by admin successfully",
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

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.query)
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await UserService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Users data fetched!",
    meta: result.meta,
    data: result.data,
  });
});

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.changeProfileStatus(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Users profile status changed!",
    data: result,
  });
});

const getMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;

    const result = await UserService.getMyProfile(user as IAuthUser);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "My profile data fetched!",
      data: result,
    });
  }
);

const updateMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;

    const result = await UserService.updateMyProfile(user as IAuthUser, req);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "My profile updated!",
      data: result,
    });
  }
);

export const UserController = {
  createAdmin,
  createDoctor,
  createDoctorByAdmin,
  createPatient,
  getAllFromDB,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};
