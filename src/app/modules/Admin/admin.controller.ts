import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.service";
import { pick } from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import { sendResponse } from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const getAllFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const filters = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await AdminService.getAllFromDB(filters, options);

  try {
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin data fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (err: any) {
    next(err);
  }
};

const getByIdFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const result = await AdminService.getByIdFromDB(id);

  try {
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin data fetched by id successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const updateIntoDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const result = await AdminService.updateIntoDB(id, req.body);

  try {
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin data updated successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const deleteFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const result = await AdminService.deleteFromDB(id);

  try {
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin data deleted successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const softDeleteFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const result = await AdminService.softDeleteFromDB(id);

  try {
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin data deleted successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

export const AdminController = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};
