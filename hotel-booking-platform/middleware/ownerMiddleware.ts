import { NextFunction, Request, Response } from "express";

export function ownerMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!_req.user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: "UNAUTHORIZED",
      });
    }

    if (_req.user.role !== "owner") {
      return res.status(403).json({
        success: false,
        data: null,
        error: "FORBIDDEN",
      });
    }
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      data: null,
      error: "FORBIDDEN",
    });
  }
}
