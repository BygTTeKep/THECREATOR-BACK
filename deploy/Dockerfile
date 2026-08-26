FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci

# ======================

FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npm run build

# ======================

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY keys ./keys

COPY ./keys/russian_trusted_root_ca_pem.crt /usr/local/share/ca-certificates/russian_trusted_root_ca.crt
COPY ./keys/russian_trusted_sub_ca_pem.crt  /usr/local/share/ca-certificates/russian_trusted_sub_ca.crt
RUN mkdir -p /app/uploads

ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/russian_trusted_root_ca.crt

EXPOSE 3001

CMD ["node", "dist/main"]