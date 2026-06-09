# Multi-service monorepo development Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy root and subdirectory packages
COPY package*.json ./
COPY rest-api/package*.json ./rest-api/
COPY saha-app-web/package*.json ./saha-app-web/

# Install dependencies for all directories
RUN npm run install:all

# Copy the rest of the files
COPY . .

# Expose backend (9000) and frontend (5173) ports
EXPOSE 9000 5173

# Start both services concurrently
CMD ["npm", "run", "dev"]
