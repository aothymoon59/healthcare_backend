import { jwtHelpers } from "./../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password is incorrect");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "gjhikgjhgikgjhkgrj",
    "15m"
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "rthtrurturtjrtjrtj",
    "30d"
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

export const AuthServices = {
  loginUser,
};
