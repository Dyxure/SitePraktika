# Сборка SPA (Vite + React)
FROM node:22-alpine AS frontend-build
WORKDIR /build/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Продакшен: Express раздаёт API и статику из frontend/dist (см. backend/src/index.js)
FROM node:22-alpine AS production
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev
COPY backend/ ./
COPY --from=frontend-build /build/frontend/dist /app/frontend/dist

ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "src/index.js"]
