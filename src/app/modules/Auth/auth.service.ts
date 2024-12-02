import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

  const accessToken = jwt.sign(
    {
      email: userData.email,
      role: userData.role,
    },
    "sdjghsfjghfdghgdf",
    { algorithm: "HS256", expiresIn: "30m" }
  );

  return userData;
};

export const AuthServices = {
  loginUser,
};
