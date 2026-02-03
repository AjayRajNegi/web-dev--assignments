import express, { Router } from "express";
import bookingController from "../../controller/api/bookings.controller";
import { customerMiddleware } from "../../middleware/customerMiddleware";

const router: Router = express.Router();

router.post("/", customerMiddleware, bookingController.makeBooking);
router.get("/", customerMiddleware, bookingController.getBooking);

export default router;
