import { jwtHelpers } from "./../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import { UserStatus } from "@prisma/client";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import emailSender from "./emailSender";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
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
      userId: userData.id,
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      userId: userData.id,
      role: userData.role,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
  } catch (err) {
    throw new Error("You are not authorized");
  }

  console.log(decodedData);

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: decodedData.userId,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      userId: userData.id,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password is incorrect");
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "Password changed successfully",
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetPasswordToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.reset_password_secret as Secret,
    config.jwt.reset_password_expires_in as string
  );

  const resetPassLink = `http://localhost:3000/reset-password?userId=${userData.id}&token=${resetPasswordToken}`;
  await emailSender(
    userData.email,
    `
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; color: #333;">
    <div style="max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
      <div style="background-color: #1586FD; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">PH Health Care</h1>
        <p style="margin: 5px 0 0;">Your Trusted Health Companion</p>
      </div>
      <div style="padding: 20px;">
        <p style="margin: 0 0 16px;">Dear User,</p>
        <p style="margin: 0 0 16px;">We received a request to reset your password. Click the button below to proceed:</p>
        <p style="margin: 0 0 16px; text-align: center;">
          <a href="${resetPassLink}" style="text-decoration: none;">
            <button style="background-color:rgb(3, 54, 108); color: white; padding: 12px 25px; border: none; border-radius: 4px; font-size: 16px; cursor: pointer;">Reset Password</button>
          </a>
        </p>
        <p style="margin: 0 0 16px;">If you did not request a password reset, please ignore this email or contact our support team.</p>
      </div>
      <div style="background-color: #f1f1f1; color: #555; padding: 10px; text-align: center; font-size: 12px;">
        <p style="margin: 0;">&copy; 2024 PH Health Care. All rights reserved.</p>
        <p style="margin: 5px 0 0;">If you have any questions, feel free to contact us at <a href="mailto:support@phhealthcare.com" style="color: #1586FD; text-decoration: none;">support@phhealthcare.com</a></p>
      </div>
    </div>
  </body>
    `
  );
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  console.log({ token, payload });

  await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.jwt.reset_password_secret as Secret
  );

  if (!isValidToken) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Forbidden!");
  }

  // hash password
  const password = await bcrypt.hash(payload.password, 12);

  // update into database
  await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password,
    },
  });
};

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
