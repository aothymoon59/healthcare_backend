import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";

export const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new Error("You are not authorized");
      }

      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.jwt_secret as Secret
      );
      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new Error("You are not authorized");
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
