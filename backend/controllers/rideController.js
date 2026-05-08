import { Booking, Notification, Ride } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createResourceController } from "./resourceController.js";
import { mapRidePayload } from "../services/resourceMapper.js";

const baseController = createResourceController({
  model: Ride,
  resourceType: "ride",
  searchableFields: ["departureCity", "destinationCity", "city", "school", "notes"],
  mapPayload: mapRidePayload
});

export const reserveRide = asyncHandler(async (req, res) => {
  const ride = await Ride.findByPk(req.params.id);
  if (!ride) throw new ApiError("Trajet introuvable", 404);

  const seats = Number(req.body.seats || 1);
  if (ride.seatsAvailable < seats) {
    throw new ApiError("Places insuffisantes pour ce trajet", 409);
  }

  await ride.update({
    seatsAvailable: ride.seatsAvailable - seats,
    status: ride.seatsAvailable - seats === 0 ? "full" : "active"
  });

  const booking = await Booking.create({
    userId: req.user.id,
    resourceType: "ride",
    resourceId: ride.id,
    seats,
    status: "confirmed"
  });

  await Notification.create({
    userId: ride.userId,
    type: "booking",
    title: "Nouvelle réservation de covoiturage",
    body: `${req.user.firstName} a réservé ${seats} place(s) pour votre trajet.`
  });

  res.status(201).json({ success: true, message: "Réservation confirmée", data: booking });
});

export const rideController = {
  ...baseController,
  reserve: reserveRide
};
