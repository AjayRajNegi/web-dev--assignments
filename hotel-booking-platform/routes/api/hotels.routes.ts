import express, { Router } from "express";
import hotelController from "../../controller/api/hotels.controller";
import { ownerMiddleware } from "../../middleware/ownerMiddleware";
import { authMiddleware } from "../../middleware/authMiddleware";

const router: Router = express.Router();

router.post("/", ownerMiddleware, hotelController.createHotel);
router.post("/:hotelId/rooms", ownerMiddleware, hotelController.createRoom);
router.get("/", authMiddleware, hotelController.getHotel);

export default router;
