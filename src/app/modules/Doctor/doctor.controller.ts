import { Request, Response } from "express";
import { DoctorService } from "./doctor.service";
// import pick from "../../../shared/pick";
import { doctorFilterableFields } from "./doctor.constants";
import { sendResponse } from "../../../shared/sendResponse";
import { pick } from "../../../shared/pick";
import { catchAsync } from "../../../shared/catchAsync";
import { StatusCodes } from "http-status-codes";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, doctorFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await DoctorService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctors retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});
const getAllUnauthorizedDoctors = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, doctorFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await DoctorService.getAllUnauthorizedDoctors(
      filters,
      options
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Pending authorized Doctors retrieval successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor retrieval successfully",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.updateIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor data updated!",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.deleteFromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor deleted successfully",
    data: result,
  });
});

const softDelete = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.softDelete(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor soft deleted successfully",
    data: result,
  });
});

export const DoctorController = {
  updateIntoDB,
  getAllFromDB,
  getAllUnauthorizedDoctors,
  getByIdFromDB,
  deleteFromDB,
  softDelete,
};
