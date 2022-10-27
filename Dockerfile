FROM node:lts as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci 
COPY . .
RUN npm run build

FROM node:lts-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --production
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/.env ./.env
EXPOSE 8080
CMD ["node", "dist/index.js"]
