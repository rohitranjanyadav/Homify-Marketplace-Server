import type { Response } from "express";

const sendResponse = async (
  res: Response,
  statusNumber: number,
  message: string,
  data: any = [],
) => {
  res.status(statusNumber).json({
    message,
    data: data.length > 0 ? data : null,
  });
};

export default sendResponse;
