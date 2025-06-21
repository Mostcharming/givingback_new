import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import db from "../config";
import { FullUser } from "../interfaces";

// Function to sign the token
const signToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Function to create and send token
export const createSendToken = (
  user: FullUser,
  statusCode: number,
  req: Request,
  res: Response
): void => {
  const token = signToken(user.id);

  res.cookie("giveback", token, {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  user.password = undefined;
  user.token = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });

  // Update `first_time_login` to false if it was true
  if (user.first_time_login) {
    db("users")
      .where({ id: user.id })
      .update({ first_time_login: false })
      .catch((err: any) => {
        console.error("Failed to update first_time_login:", err);
      });
  }
};
