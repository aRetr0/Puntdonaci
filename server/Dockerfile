FROM node:20-alpine

# Install netcat for health checks
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Copy initialization script
COPY init-db.sh ./
RUN chmod +x init-db.sh

# Expose port
EXPOSE 5000

# Use initialization script as entrypoint
CMD ["sh", "./init-db.sh"]
