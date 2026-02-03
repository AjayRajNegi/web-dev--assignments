import { Request, Response } from "express";
import z from "zod";
import { prisma } from "../../lib";

const bookingSchema = z.object({
  roomId: z.string(),
  checkInDate: z.string(),
  checkOutDate: z.string(),
  guests: z.number().min(1, "Atleast 1 guests be added."),
});
type bookingInput = z.infer<typeof bookingSchema>;

const controller = {
  makeBooking: async (_req: Request, res: Response) => {
    try {
      console.log("Hello");
      const validationResult = bookingSchema.safeParse(_req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          data: null,
          error: "INVALID_REQUEST",
        });
      }
      const { roomId, checkInDate, checkOutDate, guests } =
        validationResult.data;

      const userId = _req.user?.userId as string;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      if (checkIn <= today || checkIn >= checkOut) {
        return res.status(400).json({
          success: false,
          data: null,
          error: "INVALID_DATES",
        });
      }

      const room = await prisma.room.findFirst({
        where: {
          id: roomId,
        },
        select: {
          hotelId: true,
          maxOccupancy: true,
          pricePerNight: true,
          isAvailable: true,
        },
      });

      if (!room) {
        return res.status(404).json({
          success: false,
          data: null,
          error: "ROOM_NOT_FOUND",
        });
      }

      if (guests > room.maxOccupancy) {
        return res.status(400).json({
          success: false,
          data: null,
          error: "INVALID_CAPACITY",
        });
      }

      const conflictingBooking = await prisma.booking.findFirst({
        where: {
          roomId: roomId,
          status: { in: ["confirmed"] },
          OR: [
            {
              checkInDate: { lte: checkOut },
              checkOutDate: { gte: checkIn },
            },
          ],
        },
      });

      if (conflictingBooking) {
        return res.status(400).json({
          success: false,
          data: null,
          error: "ROOM_NOT_AVAILABLE",
        });
      }

      const booking = await prisma.booking.create({
        data: {
          userId: userId,
          roomId: roomId,
          hotelId: room.hotelId,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          guests: guests,
          totalPrice: 21423,
          status: "confirmed",
        },
        select: {
          id: true,
          status: true,
          bookingDate: true,
        },
      });

      if (booking) {
        return res.status(200).json({
          success: true,
          data: booking,
          error: "ROABLE",
        });
      }
      return res.status(200).json({
        success: false,
        data: null,
        error: "ROABLE",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        data: null,
        error: error,
      });
    }
  },
  getBooking: async (_req: Request, res: Response) => {
    try {
      const userId = _req.user?.userId;

      const booking = await prisma.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          bookings: {
            select: {
              id: true,
              roomId: true,
              hotelId: true,
              hotel: {
                select: {
                  name: true,
                },
              },
              room: {
                select: {
                  roomNumber: true,
                  roomType: true,
                },
              },
              checkInDate: true,
              checkOutDate: true,
              guests: true,
              status: true,
              bookingDate: true,
            },
          },
        },
      });

      return res.status(200).json({
        success: false,
        data: booking,
        error: null,
      });
    } catch (error) {}
  },
};
export default controller;
