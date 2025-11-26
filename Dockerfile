# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
# VITE_API_URL is set to /api so calls are relative and handled by Nginx proxy
ENV VITE_API_URL=/api
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage to Nginx
# Note: vite.config.ts sets outDir to 'build'
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
