# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install all deps (including dev for tsc)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Runtime stage
FROM node:18-alpine AS runner

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
