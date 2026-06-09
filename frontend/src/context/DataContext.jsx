import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api.js";
import { useAuth } from "./AuthContext.jsx";
import { mockConversations, mockListings, mockNotifications, mockReviews } from "../utils/mockData.js";

const DataContext = createContext(null);
const modules = ["housing", "marketplace", "rides", "events", "jobs"];

const normalizeItem = (module, item) => ({
  ...item,
  module,
  ownerId: item.ownerId || item.userId,
  price: item.price ?? item.pricePerSeat ?? 0
});

const apiPayload = (module, payload, user) => {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString();
  const common = {
    ...payload,
    school: payload.school || user?.school || "Autre école",
    city: payload.city || user?.city || "Casablanca"
  };

  if (module === "housing") {
    return { ...common, address: common.address || common.city, rooms: 1, availableFrom: common.availableFrom || today };
  }
  if (module === "rides") {
    return {
      ...common,
      departureAddress: common.departureAddress || common.departureCity,
      destinationAddress: common.destinationAddress || common.destinationCity,
      departureAt: common.departureAt || tomorrow,
      seatsTotal: Number(common.seatsAvailable || 1),
      pricePerSeat: Number(common.price || 0)
    };
  }
  if (module === "events") {
    return { ...common, venue: common.venue || common.city, startsAt: common.startsAt || tomorrow };
  }
  if (module === "jobs") {
    return { ...common, contactEmail: common.contactEmail || user?.email || "contact@stoon.ma" };
  }
  return common;
};

export function DataProvider({ children }) {
  const [listings, setListings] = useState(mockListings);
  const [favorites, setFavorites] = useState([{ module: "housing", id: 1 }]);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [conversations, setConversations] = useState(mockConversations);
  const [reviews, setReviews] = useState(mockReviews);
  const { user } = useAuth();

  useEffect(() => {
    let active = true;
    Promise.all(modules.map((module) => api.get(`/${module}`, { params: { limit: 50 } })))
      .then((responses) => {
        if (!active) return;
        setListings(
          Object.fromEntries(
            modules.map((module, index) => [
              module,
              responses[index].data.data.map((item) => normalizeItem(module, item))
            ])
          )
        );
      })
      .catch(() => {
        // Le catalogue de démonstration reste disponible hors connexion.
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    api.get("/users/me/notifications")
      .then((response) => setNotifications(response.data.data))
      .catch(() => {});
  }, [user]);

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

  const addListing = async (module, payload, currentUser = user) => {
    let item;
    try {
      const response = await api.post(`/${module}`, apiPayload(module, payload, currentUser));
      item = normalizeItem(module, response.data.data);
    } catch (error) {
      if (error.response) throw error;
      item = {
        id: Date.now(),
        module,
        ownerId: currentUser?.id || 1,
        status: "active",
        views: 0,
        createdAt: new Date().toISOString(),
        ...payload
      };
    }

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

  const toggleFavorite = async (module, id) => {
    if (user) {
      await api.post(`/${module}/${id}/favorite`).catch(() => {});
    }
    setFavorites((current) => {
      const exists = current.some((item) => item.module === module && item.id === id);
      return exists
        ? current.filter((item) => !(item.module === module && item.id === id))
        : [...current, { module, id }];
    });
  };

  const reserve = async (module, id, seats = 1) => {
    if (user) {
      await api.post(`/${module}/${id}/reservations`, { seats });
    }
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
    if (user) {
      api.patch(`/users/me/notifications/${id}/read`).catch(() => {});
    }
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
