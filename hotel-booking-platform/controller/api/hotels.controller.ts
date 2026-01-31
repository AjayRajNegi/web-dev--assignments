import { Request, Response } from "express";

const controller = {
  createHotel: async (_req: Request, res: Response) => {
    return res.json({
      message: "Success",
    });
  },
};
export default controller;
