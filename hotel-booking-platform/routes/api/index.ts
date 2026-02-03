import express, { Router } from "express";
import authRoutes from "./auth.routes";
import hotelRoutes from "./hotels.routes";
import bookingRoutes from "./bookings.routes";
import { authMiddleware } from "../../middleware/authMiddleware";

const router: Router = express.Router();

router.use("/auth", authRoutes);
router.use("/hotels", authMiddleware, hotelRoutes);
router.use("/bookings", authMiddleware, bookingRoutes);

export default router;
