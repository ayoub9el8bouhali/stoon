import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("stoon_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const endpoints = {
  auth: "/auth",
  users: "/users",
  housing: "/housing",
  marketplace: "/marketplace",
  rides: "/rides",
  events: "/events",
  jobs: "/jobs",
  messages: "/messages",
  reviews: "/reviews",
  admin: "/admin",
  cities: "/cities",
  schools: "/schools",
  programs: "/programs"
};
