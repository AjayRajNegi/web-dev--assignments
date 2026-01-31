import express, { Router } from "express";
import hotelController from "../../controller/api/hotels.controller";

const router: Router = express.Router();

router.get("/", hotelController.createHotel);

export default router;
