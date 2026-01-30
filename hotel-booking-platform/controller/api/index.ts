import { Request, Response } from "express";

const controller = async (
  _req: Request,
  res: Response,
): Promise<void | Response> => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};

export default controller;
