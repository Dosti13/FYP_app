# Build stage
FROM node:22-alpine

WORKDIR /app

# Install required dependencies
RUN apk add --no-cache git python3 make g++

# Copy package files
COPY package*.json ./
COPY eas.json ./
COPY app.config.js ./
COPY tsconfig.json ./
COPY expo-env.d.ts ./

# Install dependencies
RUN npm ci

# Install EAS CLI globally
RUN npm install -g eas-cli

# Copy the entire project
COPY . .

# Expose port for web preview (optional)
EXPOSE 3000 8081 19000 19001

# Default command - show available scripts
CMD ["npm", "run", "android"]
