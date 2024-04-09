# Start from the updated base image
FROM node:18.19.0-alpine3.18 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Default command
CMD ["npm", "run", "start"]
