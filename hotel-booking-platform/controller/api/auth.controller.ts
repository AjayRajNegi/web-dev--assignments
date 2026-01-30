import { Request, Response } from "express";

const controller = {
  login: async (_req: Request, res: Response) => {
    console.log("Login contoller");
    return res.json({ message: "Logged in (stub)" });
  },
  signup: async (_req: Request, res: Response) => {
    console.log("Login contoller");
    return res.json({ message: "Logged in (stub)" });
  },
};

export default controller;
