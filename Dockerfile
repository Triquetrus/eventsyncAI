FROM node:22-slim

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install dependencies
RUN npm ci || npm install

# Copy application code
COPY . .

# Build frontend and server
RUN npm run build

# Default Cloud Run port
EXPOSE 8080

ENV PORT=8080
ENV NODE_ENV=production

# Start production application
CMD ["node", "dist/server.cjs"]
