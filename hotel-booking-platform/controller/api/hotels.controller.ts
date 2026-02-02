import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../lib";

const hotelSchema = z.object({
  name: z.string().min(8, "Name is required.").max(50, "Name is too long."),
  description: z.string().min(10, "Give a description.").optional(),
  address: z.string().min(5, "Address should be valid.").optional(),
  city: z.string().min(3, "City should be valid."),
  country: z.string().min(3, "Country should be valid."),
  amenities: z.array(z.string().min(3, "Amenity name is too short.")),
  images: z.array(z.string().url("Invalid image URL.")).default([]).optional(),
});
const roomSchema = z.object({
  roomNumber: z.string(),
  roomType: z.string(),
  pricePerNight: z.number(),
  maxOccupancy: z.number(),
  description: z.string().min(10, "Add longer description.").optional(),
  isAvailable: z.boolean().optional(),
  images: z.array(z.string().url("Invalid image URL.")).default([]).optional(),
});

type hotelInput = z.infer<typeof hotelSchema>;
type roomInput = z.infer<typeof roomSchema>;

const controller = {
  createHotel: async (_req: Request, res: Response) => {
    try {
      const validationResult = hotelSchema.safeParse(_req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          data: null,
          error: "INVALID_REQUEST",
        });
      }

      const { name, description, city, country, amenities, address, images } =
        validationResult.data;

      const hotel = await prisma.hotel.create({
        data: {
          ownerId: _req.user!.userId,
          name,
          description,
          city,
          country,
          amenities,
          address,
          images,
        },
        select: {
          id: true,
          ownerId: true,
          name: true,
          description: true,
          city: true,
          country: true,
          amenities: true,
          rating: true,
          totalReviews: true,
        },
      });

      return res.status(201).json({
        success: true,
        data: hotel,
        error: null,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        data: null,
        error: "INTERNAL_SERVER_ERROR",
      });
    }
  },
  createRoom: async (_req: Request, res: Response) => {
    try {
      const validationResult = roomSchema.safeParse(_req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          data: null,
          error: "INVALID_REQUEST",
        });
      }

      const hotelId = _req.params.hotelId as string;
      const userId = _req.user?.userId;

      const hotel = await prisma.hotel.findUnique({
        where: { id: hotelId },
        select: { ownerId: true },
      });

      if (!hotel) {
        return res.status(404).json({
          success: false,
          data: null,
          error: "HOTEL_NOT_FOUND",
        });
      }

      if (hotel.ownerId !== userId) {
        return res.status(403).json({
          success: false,
          data: null,
          error: "FORBIDDEN23",
        });
      }

      const {
        roomNumber,
        roomType,
        pricePerNight,
        maxOccupancy,
        description,
        isAvailable,
      } = validationResult.data;

      try {
        const newRoom = await prisma.room.create({
          data: {
            hotelId,
            roomNumber,
            roomType,
            pricePerNight,
            maxOccupancy,
            description,
            isAvailable,
          },
          select: {
            id: true,
            hotelId: true,
            roomNumber: true,
            roomType: true,
            pricePerNight: true,
            maxOccupancy: true,
          },
        });

        return res.status(201).json({
          success: true,
          data: newRoom,
          error: null,
        });
      } catch (createError: any) {
        if (createError.code === "P2002") {
          return res.status(400).json({
            success: false,
            data: null,
            error: "ROOM_ALREADY_EXISTS",
          });
        }
        throw createError;
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        data: null,
        error: "INTERNAL_SERVER_ERROR",
      });
    }
  },
  getHotel: async (_req: Request, res: Response) => {
    try {
      const city = _req.query.city as string | undefined;
      const country = _req.query.country as string | undefined;

      const minPrice = _req.query.minPrice
        ? Number(_req.query.minPrice)
        : undefined;
      const maxPrice = _req.query.maxPrice
        ? Number(_req.query.maxPrice)
        : undefined;
      const minRating = _req.query.minRating
        ? Number(_req.query.minRating)
        : undefined;

      const data = await prisma.hotel.findMany({
        where: {
          ...(city && {
            city: {
              equals: city,
              mode: "insensitive",
            },
          }),
          ...(country && {
            country: {
              equals: country,
              mode: "insensitive",
            },
          }),
          ...(minRating !== undefined && {
            rating: {
              gte: minRating,
            },
          }),
          ...((minPrice !== undefined || maxPrice !== undefined) && {
            rooms: {
              some: {
                pricePerNight: {
                  ...(minPrice !== undefined && { gte: minPrice }),
                  ...(maxPrice !== undefined && { lte: maxPrice }),
                },
              },
            },
          }),
        },
        select: {
          id: true,
          name: true,
          description: true,
          city: true,
          country: true,
          amenities: true,
          rating: true,
          totalReviews: true,

          rooms: {
            select: {
              pricePerNight: true,
            },
          },
        },
      });

      if (data.length === 0) {
        return res.status(404).json({
          success: false,
          data: null,
          error: "HOTEL_NOT_FOUND",
        });
      }

      const formattedData = data.map(({ rooms, ...hotel }) => ({
        ...hotel,
        minPricePerNight: rooms.length
          ? Math.min(...rooms.map((r) => Number(r.pricePerNight)))
          : null,
      }));

      return res.json({
        success: true,
        data: formattedData,
        error: null,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        data: null,
        error: "INTERNAL_SERVER_ERROR",
      });
    }
  },
};
export default controller;
