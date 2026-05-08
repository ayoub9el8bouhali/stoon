import { Booking, Event, Notification } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createResourceController } from "./resourceController.js";
import { mapEventPayload } from "../services/resourceMapper.js";

const baseController = createResourceController({
  model: Event,
  resourceType: "event",
  searchableFields: ["title", "description", "city", "school", "venue"],
  mapPayload: mapEventPayload
});

export const reserveEvent = asyncHandler(async (req, res) => {
  const event = await Event.findByPk(req.params.id);
  if (!event) throw new ApiError("Événement introuvable", 404);

  const seats = Number(req.body.seats || 1);
  const remaining = event.capacity - event.reservedSeats;
  if (remaining < seats) {
    throw new ApiError("Places insuffisantes pour cet événement", 409);
  }

  await event.update({
    reservedSeats: event.reservedSeats + seats,
    status: event.reservedSeats + seats >= event.capacity ? "full" : "active"
  });

  const booking = await Booking.create({
    userId: req.user.id,
    resourceType: "event",
    resourceId: event.id,
    seats,
    status: "confirmed"
  });

  await Notification.create({
    userId: event.userId,
    type: "booking",
    title: "Nouvelle réservation événement",
    body: `${req.user.firstName} a réservé ${seats} place(s) pour ${event.title}.`
  });

  res.status(201).json({ success: true, message: "Participation confirmée", data: booking });
});

export const eventController = {
  ...baseController,
  reserve: reserveEvent
};
