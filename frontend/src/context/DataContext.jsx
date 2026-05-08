import { createContext, useContext, useMemo, useState } from "react";
import { mockConversations, mockListings, mockNotifications, mockReviews } from "../utils/mockData.js";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [listings, setListings] = useState(mockListings);
  const [favorites, setFavorites] = useState([{ module: "housing", id: 1 }]);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [conversations, setConversations] = useState(mockConversations);
  const [reviews, setReviews] = useState(mockReviews);

  const allListings = useMemo(
    () =>
      Object.entries(listings).flatMap(([module, items]) =>
        items.map((item) => ({
          ...item,
          module
        }))
      ),
    [listings]
  );

  const addListing = (module, payload, user) => {
    const item = {
      id: Date.now(),
      module,
      ownerId: user?.id || 1,
      status: "active",
      views: 0,
      createdAt: new Date().toISOString(),
      ...payload
    };

    setListings((current) => ({
      ...current,
      [module]: [item, ...(current[module] || [])]
    }));

    setNotifications((current) => [
      {
        id: Date.now(),
        type: "system",
        title: "Annonce publiée",
        body: `${item.title} est maintenant visible sur ST00N.`,
        isRead: false,
        createdAt: new Date().toISOString()
      },
      ...current
    ]);

    return item;
  };

  const toggleFavorite = (module, id) => {
    setFavorites((current) => {
      const exists = current.some((item) => item.module === module && item.id === id);
      return exists
        ? current.filter((item) => !(item.module === module && item.id === id))
        : [...current, { module, id }];
    });
  };

  const reserve = (module, id, seats = 1) => {
    setListings((current) => ({
      ...current,
      [module]: current[module].map((item) => {
        if (item.id !== Number(id)) return item;
        if (module === "rides") {
          const seatsAvailable = Math.max((item.seatsAvailable || 0) - seats, 0);
          return { ...item, seatsAvailable, status: seatsAvailable === 0 ? "full" : item.status };
        }
        if (module === "events") {
          const reservedSeats = Math.min((item.reservedSeats || 0) + seats, item.capacity || seats);
          return { ...item, reservedSeats, status: reservedSeats >= item.capacity ? "full" : item.status };
        }
        return item;
      })
    }));

    setNotifications((current) => [
      {
        id: Date.now(),
        type: "booking",
        title: "Réservation enregistrée",
        body: "Votre réservation a été enregistrée en simulation temps réel.",
        isRead: false,
        createdAt: new Date().toISOString()
      },
      ...current
    ]);
  };

  const sendMessage = (conversationId, senderId, body) => {
    const message = {
      id: Date.now(),
      senderId,
      body,
      createdAt: new Date().toISOString()
    };

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, messages: [...conversation.messages, message] }
          : conversation
      )
    );
  };

  const markNotificationRead = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const value = useMemo(
    () => ({
      listings,
      allListings,
      favorites,
      notifications,
      conversations,
      reviews,
      addListing,
      toggleFavorite,
      reserve,
      sendMessage,
      markNotificationRead,
      setReviews
    }),
    [listings, allListings, favorites, notifications, conversations, reviews]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => useContext(DataContext);
