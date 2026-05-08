import {
  Conversation,
  ConversationParticipant,
  Message,
  Notification,
  User
} from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { publicFilePaths } from "../middlewares/uploadMiddleware.js";

const participantInclude = {
  model: User,
  as: "participants",
  attributes: ["id", "firstName", "lastName", "photo", "city", "school"]
};

export const listConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.findAll({
    include: [
      {
        ...participantInclude,
        through: { attributes: ["lastReadAt"] },
        where: { id: req.user.id },
        required: true
      },
      {
        model: Message,
        as: "messages",
        limit: 1,
        separate: true,
        order: [["createdAt", "DESC"]],
        include: [{ model: User, as: "sender", attributes: ["id", "firstName", "lastName", "photo"] }]
      }
    ],
    order: [["lastMessageAt", "DESC"]]
  });

  res.json({ success: true, data: conversations });
});

export const createConversation = asyncHandler(async (req, res) => {
  if (!req.body.participantId) {
    throw new ApiError("Participant requis", 422);
  }

  const participant = await User.findByPk(req.body.participantId);
  if (!participant) {
    throw new ApiError("Participant introuvable", 404);
  }

  const conversation = await Conversation.create({
    title: `${req.user.firstName} & ${participant.firstName}`,
    lastMessageAt: new Date()
  });

  await ConversationParticipant.bulkCreate([
    { conversationId: conversation.id, userId: req.user.id },
    { conversationId: conversation.id, userId: participant.id }
  ]);

  const message = await Message.create({
    conversationId: conversation.id,
    senderId: req.user.id,
    body: req.body.body,
    attachments: publicFilePaths(req.files)
  });

  await Notification.create({
    userId: participant.id,
    type: "message",
    title: "Nouveau message",
    body: `${req.user.firstName} vous a envoyé un message.`
  });

  const fullConversation = await Conversation.findByPk(conversation.id, {
    include: [participantInclude, { model: Message, as: "messages" }]
  });

  res.status(201).json({ success: true, data: fullConversation, message });
});

export const listMessages = asyncHandler(async (req, res) => {
  const membership = await ConversationParticipant.findOne({
    where: { conversationId: req.params.id, userId: req.user.id }
  });

  if (!membership) {
    throw new ApiError("Conversation introuvable", 404);
  }

  await membership.update({ lastReadAt: new Date() });

  const messages = await Message.findAll({
    where: { conversationId: req.params.id },
    include: [{ model: User, as: "sender", attributes: ["id", "firstName", "lastName", "photo"] }],
    order: [["createdAt", "ASC"]]
  });

  res.json({ success: true, data: messages });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const membership = await ConversationParticipant.findOne({
    where: { conversationId: req.params.id, userId: req.user.id }
  });

  if (!membership) {
    throw new ApiError("Conversation introuvable", 404);
  }

  const message = await Message.create({
    conversationId: req.params.id,
    senderId: req.user.id,
    body: req.body.body,
    attachments: publicFilePaths(req.files)
  });

  await Conversation.update({ lastMessageAt: new Date() }, { where: { id: req.params.id } });

  const participants = await ConversationParticipant.findAll({
    where: { conversationId: req.params.id }
  });

  await Promise.all(
    participants
      .filter((participant) => participant.userId !== req.user.id)
      .map((participant) =>
        Notification.create({
          userId: participant.userId,
          type: "message",
          title: "Nouveau message",
          body: `${req.user.firstName} a répondu à votre conversation.`
        })
      )
  );

  res.status(201).json({ success: true, data: message });
});
