import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { PaymentService } from "./payment.service";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../../shared/sendResponse";

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.initPayment();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Payment initiate successfully!",
    data: result,
  });
});

export const PaymentController = {
  initPayment,
};
