import { NextFunction, Request, Response } from "express";

function hello(_req: Request, res: Response, next: NextFunction) {
  //
  console.log("Hello Middleware");
  next();
}
export default hello;
