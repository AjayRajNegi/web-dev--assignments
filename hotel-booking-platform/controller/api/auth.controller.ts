import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../../lib";
import jwt from "jsonwebtoken";
import { z } from "zod";

const controller = {
  login: async (_req: Request, res: Response) => {
    try {
      const { email, password } = _req.body;

      //Validate input
      if (!email || !password) {
        return res.status(400).json({
          status: false,
          data: null,
          error: "INVALID_REQUEST",
        });
      }

      //Find user
      const user = await prisma.user.findFirst({
        where: {
          email: email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          role: true,
        },
      });

      if (!user) {
        return res.status(401).json({
          status: false,
          data: null,
          error: "INVALID_CREDENTIALS",
        });
      }

      const isPasswordValid = await bcrypt.hash(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          status: false,
          data: null,
          error: "INVALID_CREDENTIALS",
        });
      }

      //Sign a token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || "secret-key",
        { expiresIn: "24h" },
      );

      return res.status(200).json({
        success: true,
        data: {
          token: token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
        error: null,
      });
    } catch (error) {
      console.log("Login error:", error);
      return res.status(500).json({
        success: false,
        data: null,
        error: "INTERNAL_SERVER_ERROR",
      });
    }
  },
  signup: async (_req: Request, res: Response) => {
    try {
      const { name, email, password, role, phone } = _req.body;

      if (!name || !email || !password || !role) {
        return res.status(400).json({
          success: false,
          data: null,
          error: "INVALID_REQUEST",
        });
      }

      //Check is the email exists
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (user) {
        return res.status(400).json({
          success: false,
          data: null,
          error: "EMAIL_ALREADY_EXISTS",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
          phone,
        },
      });

      return res.status(201).json({
        success: true,
        data: {
          id: newUser.id,
          name,
          email,
          role,
          phone,
        },
        error: null,
      });
    } catch (error) {
      console.log("SignUp error:", error);
      return res.status(500).json({
        success: false,
        data: null,
        error: "INTERNAL_SERVER_ERROR",
      });
    }
  },
};

export default controller;
