FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PYTHON_BIN=python3

COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev

COPY backend ./backend
COPY frontend ./frontend

WORKDIR /app/backend

EXPOSE 5000

CMD ["npm", "start"]
