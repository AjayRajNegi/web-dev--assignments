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
type hotelInput = z.infer<typeof hotelSchema>;

const controller = {
  createHotel: async (_req: Request, res: Response) => {
    try {
      const validationResult = hotelSchema.safeParse(_req.body);
      console.log(validationResult.error, "Data", validationResult.data);

      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          data: null,
          error: "INVALID_REQUEST",
        });
      }

      const { name, description, address, city, country, amenities, images } =
        validationResult.data;

      if (!_req.user?.userId) {
        return res.status(401).json({
          success: false,
          data: null,
          error: "UNAUTHORIZED",
        });
      }

      const hotel = await prisma.hotel.create({
        data: {
          ownerId: _req.user.userId,
          name: name,
          description,
          city,
          country,
          amenities,
        },
      });

      if (!hotel) {
        return res.status(401).json({
          success: false,
          data: null,
          error: "UNAUTHORIZED",
        });
      }

      return res.status(201).json({
        success: true,
        data: {
          id: hotel.id,
          ownerId: hotel.ownerId,
          name: hotel.name,
          descripton: hotel.description,
          city: hotel.city,
          country: hotel.country,
          amenities: hotel.amenities,
          rating: hotel.rating,
          totalReviews: hotel.totalReviews,
        },
        error: null,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        data: null,
        error: "UNAUTHORIZED",
      });
    }
  },
};
export default controller;
