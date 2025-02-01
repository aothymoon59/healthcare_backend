import prisma from "../../shared/prisma";
import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";

/**
 * Middleware to check if the doctor is authorized to perform the request.
 * @param {Request & { user?: any }} req Request object
 * @param {Response} res Response object
 * @param {NextFunction} next Next function
 */

export const checkDoctorAuthorization = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized");
    }

    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.jwt_secret as Secret
    );

    req.user = verifiedUser;

    const doctor = await prisma.doctor.findUnique({
      where: { email: req?.user?.email }, // Assuming user email is extracted from JWT
    });

    if (!doctor || !doctor?.isAuthorizedDoctor) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Doctor not authorized.",
      });
    }

    next();
  } catch (err) {
    next(err);
  }
};
