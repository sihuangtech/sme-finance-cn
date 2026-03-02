FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY shared ./shared
COPY backend ./backend
RUN npm install
RUN npm run build --workspace=@sme-finance/shared
RUN cd backend && npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["node", "dist/index.js"]
