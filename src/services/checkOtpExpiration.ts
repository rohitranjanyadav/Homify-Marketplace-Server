import type { Response } from "express";
import sendResponse from "./sendResponse.ts";

const checkOtpExpiration = (
  res: Response,
  otpGeneratedTime: string,
  thresholdTime: number,
) => {
  const currentTime = Date.now();

  if (currentTime - parseInt(otpGeneratedTime) <= thresholdTime) {
    sendResponse(res, 200, "Valid OTP, you can proceed to reset password");
  } else {
    sendResponse(res, 403, "OTP expired, Try again later!!");
  }
};

export default checkOtpExpiration;
