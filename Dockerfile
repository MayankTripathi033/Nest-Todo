# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

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

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]
