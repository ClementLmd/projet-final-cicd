# syntax=docker/dockerfile:1.6

# ---------- Stage 1: builder ----------
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# ---------- Stage 2: production ----------
FROM node:18-alpine AS production

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/src ./src

USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --spider --quiet http://localhost:5000/health || exit 1

CMD ["node", "src/server.js"]
