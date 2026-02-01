import express, { Router } from "express";
import hotelController from "../../controller/api/hotels.controller";
import { ownerMiddleware } from "../../middleware/ownerMiddleware";

const router: Router = express.Router();

router.post("/", ownerMiddleware, hotelController.createHotel);
router.post("/:hotelId/rooms", ownerMiddleware, hotelController.createRoom);

export default router;
