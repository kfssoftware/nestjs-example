FROM node:16 as builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . ./
RUN npm run build

FROM node:16
WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY --from=builder /app/dist ./

HEALTHCHECK --interval=20s --timeout=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider localhost:3000/health || exit 1

EXPOSE 3000
CMD npm run start:prod
