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
  attributes: ["id", "firstName", "lastName", "photo", "city", "school"],
  through: { attributes: [] }
};

export const listConversations = asyncHandler(async (req, res) => {
  const memberships = await ConversationParticipant.findAll({ where: { userId: req.user.id } });
  const conversationIds = memberships.map(item => item.conversationId);
  if (!conversationIds.length) {
    return res.json({ success: true, data: [] });
  }

  const conversations = await Conversation.findAll({
    where: { id: conversationIds },
    include: [
      participantInclude,
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

  const readMap = new Map(memberships.map(item => [item.conversationId, item.lastReadAt]));
  const data = conversations.map(conversation => {
    const plain = conversation.get({ plain: true });
    const latest = plain.messages?.[0];
    return {
      ...plain,
      otherParticipants: plain.participants.filter(participant => participant.id !== req.user.id),
      unread: Boolean(latest && latest.senderId !== req.user.id && (!readMap.get(plain.id) || new Date(latest.createdAt) > new Date(readMap.get(plain.id))))
    };
  });

  res.json({ success: true, data });
});

export const createConversation = asyncHandler(async (req, res) => {
  if (!req.body.participantId) {
    throw new ApiError("Participant requis", 422);
  }

  const participant = await User.findByPk(req.body.participantId);
  if (!participant) {
    throw new ApiError("Participant introuvable", 404);
  }
  if (participant.id === req.user.id) {
    throw new ApiError("Vous ne pouvez pas démarrer une conversation avec vous-même", 422);
  }

  const myMemberships = await ConversationParticipant.findAll({
    where: { userId: req.user.id },
    attributes: ["conversationId"]
  });
  const existingMembership = await ConversationParticipant.findOne({
    where: {
      userId: participant.id,
      conversationId: myMemberships.map(item => item.conversationId)
    }
  });
  const existingConversation = existingMembership
    ? await Conversation.findByPk(existingMembership.conversationId)
    : null;
  const conversation = existingConversation || await Conversation.create({
    title: `${req.user.firstName} & ${participant.firstName}`,
    lastMessageAt: new Date()
  });

  if (!existingConversation) {
    await ConversationParticipant.bulkCreate([
      { conversationId: conversation.id, userId: req.user.id },
      { conversationId: conversation.id, userId: participant.id }
    ]);
  } else {
    await conversation.update({ lastMessageAt: new Date() });
  }

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

  res.status(existingConversation ? 200 : 201).json({
    success: true,
    data: fullConversation,
    message,
    reused: Boolean(existingConversation)
  });
});

export const listMessages = asyncHandler(async (req, res) => {
  const membership = await ConversationParticipant.findOne({
    where: { conversationId: req.params.id, userId: req.user.id }
  });

  if (!membership) {
    throw new ApiError("Conversation introuvable", 404);
  }

  await membership.update({ lastReadAt: new Date() });

  const rows = await Message.findAll({
    where: { conversationId: req.params.id },
    include: [{ model: User, as: "sender", attributes: ["id", "firstName", "lastName", "photo"] }],
    order: [["createdAt", "DESC"]],
    limit: 101
  });

  res.json({
    success: true,
    data: rows.slice(0, 100).reverse(),
    meta: { hasOlderMessages: rows.length > 100 }
  });
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

  const fullMessage = await Message.findByPk(message.id, {
    include: [{ model: User, as: "sender", attributes: ["id", "firstName", "lastName", "photo"] }]
  });

  res.status(201).json({ success: true, data: fullMessage });
});
