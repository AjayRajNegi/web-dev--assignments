import express, { Router } from "express";
import hotelController from "../../controller/api/hotels.controller";
import { ownerMiddleware } from "../../middleware/ownerMiddleware";

const router: Router = express.Router();

router.get("/", ownerMiddleware, hotelController.createHotel);

export default router;
