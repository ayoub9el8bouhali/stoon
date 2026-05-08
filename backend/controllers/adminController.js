import {
  Booking,
  Event,
  Favorite,
  Housing,
  Job,
  MarketplaceItem,
  Report,
  Ride,
  User
} from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAdminStats = asyncHandler(async (req, res) => {
  const [users, housing, marketplace, rides, events, jobs, bookings, favorites, reports] =
    await Promise.all([
      User.count(),
      Housing.count(),
      MarketplaceItem.count(),
      Ride.count(),
      Event.count(),
      Job.count(),
      Booking.count(),
      Favorite.count(),
      Report.count({ where: { status: "open" } })
    ]);

  res.json({
    success: true,
    data: {
      users,
      announcements: housing + marketplace + rides + events + jobs,
      housing,
      marketplace,
      rides,
      events,
      jobs,
      bookings,
      favorites,
      openReports: reports
    }
  });
});

export const listReports = asyncHandler(async (req, res) => {
  const reports = await Report.findAll({
    include: [{ model: User, as: "reporter", attributes: ["id", "firstName", "lastName", "email"] }],
    order: [["createdAt", "DESC"]],
    limit: 100
  });

  res.json({ success: true, data: reports });
});
