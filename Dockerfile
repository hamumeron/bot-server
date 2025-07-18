FROM node:18
WORKDIR /app
COPY backend ./backend
WORKDIR /app/backend
RUN npm install
CMD ["npm", "run", "dev"]

