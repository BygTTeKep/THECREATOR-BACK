FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY .env ./
COPY uploads ./uploads
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./
COPY --from=builder /app/uploads ./uploads

EXPOSE 3001

CMD ["node", "dist/main"]
