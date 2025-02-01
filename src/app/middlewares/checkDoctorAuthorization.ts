import prisma from "../../shared/prisma";
import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";

export const checkDoctorAuthorization = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return next(
          new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized")
        );
      }

      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.jwt_secret as Secret
      );

      req.user = verifiedUser;

      // If user is not a doctor, skip this middleware
      if (req.user?.role !== "DOCTOR") {
        return next();
      }

      // Proceed with doctor-specific checks
      const doctor = await prisma.doctor.findUnique({
        where: { email: req?.user?.email },
      });

      if (!doctor || !doctor?.isAuthorizedDoctor) {
        return next(
          new ApiError(
            StatusCodes.FORBIDDEN,
            "Access denied. Doctor not authorized."
          )
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
