import { sequelize } from "../config/database.js";
import { User } from "./User.js";
import { Housing } from "./Housing.js";
import { MarketplaceItem } from "./MarketplaceItem.js";
import { Ride } from "./Ride.js";
import { Event } from "./Event.js";
import { Job } from "./Job.js";
import { Conversation } from "./Conversation.js";
import { ConversationParticipant } from "./ConversationParticipant.js";
import { Message } from "./Message.js";
import { Review } from "./Review.js";
import { Favorite } from "./Favorite.js";
import { Booking } from "./Booking.js";
import { Notification } from "./Notification.js";
import { Report } from "./Report.js";

const ownerOptions = { foreignKey: { name: "userId", allowNull: false }, as: "owner" };

User.hasMany(Housing, { foreignKey: "userId", as: "housingAds", onDelete: "CASCADE" });
Housing.belongsTo(User, ownerOptions);

User.hasMany(MarketplaceItem, { foreignKey: "userId", as: "marketplaceItems", onDelete: "CASCADE" });
MarketplaceItem.belongsTo(User, ownerOptions);

User.hasMany(Ride, { foreignKey: "userId", as: "rides", onDelete: "CASCADE" });
Ride.belongsTo(User, ownerOptions);

User.hasMany(Event, { foreignKey: "userId", as: "events", onDelete: "CASCADE" });
Event.belongsTo(User, ownerOptions);

User.hasMany(Job, { foreignKey: "userId", as: "jobs", onDelete: "CASCADE" });
Job.belongsTo(User, ownerOptions);

User.belongsToMany(Conversation, {
  through: ConversationParticipant,
  foreignKey: "userId",
  otherKey: "conversationId",
  as: "conversations"
});
Conversation.belongsToMany(User, {
  through: ConversationParticipant,
  foreignKey: "conversationId",
  otherKey: "userId",
  as: "participants"
});

Conversation.hasMany(Message, { foreignKey: "conversationId", as: "messages", onDelete: "CASCADE" });
Message.belongsTo(Conversation, { foreignKey: "conversationId", as: "conversation" });
User.hasMany(Message, { foreignKey: "senderId", as: "sentMessages", onDelete: "CASCADE" });
Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });

User.hasMany(Review, { foreignKey: "reviewerId", as: "givenReviews", onDelete: "CASCADE" });
User.hasMany(Review, { foreignKey: "targetUserId", as: "receivedReviews", onDelete: "CASCADE" });
Review.belongsTo(User, { foreignKey: "reviewerId", as: "reviewer" });
Review.belongsTo(User, { foreignKey: "targetUserId", as: "targetUser" });

User.hasMany(Favorite, { foreignKey: "userId", as: "favorites", onDelete: "CASCADE" });
Favorite.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Booking, { foreignKey: "userId", as: "bookings", onDelete: "CASCADE" });
Booking.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Notification, { foreignKey: "userId", as: "notifications", onDelete: "CASCADE" });
Notification.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Report, { foreignKey: "reporterId", as: "reports", onDelete: "CASCADE" });
Report.belongsTo(User, { foreignKey: "reporterId", as: "reporter" });

export {
  sequelize,
  User,
  Housing,
  MarketplaceItem,
  Ride,
  Event,
  Job,
  Conversation,
  ConversationParticipant,
  Message,
  Review,
  Favorite,
  Booking,
  Notification,
  Report
};
