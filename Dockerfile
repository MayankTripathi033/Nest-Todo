# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Set dummy DATABASE_URL for build (Prisma needs it to generate client)
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"

# Copy package files
COPY package*.json ./

# Copy Prisma schema
COPY prisma ./prisma

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build NestJS application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Set dummy DATABASE_URL for Prisma client generation
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"

# Copy package files
COPY package*.json ./

# Copy Prisma schema
COPY prisma ./prisma

# Install production dependencies only
RUN npm ci --only=production

# Generate Prisma client
RUN npx prisma generate

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3001

# The real DATABASE_URL will be provided at runtime
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]
