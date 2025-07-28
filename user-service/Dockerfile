# Multi-stage build for User Service - Enterprise Edition
# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Copy shared library first
COPY shared/package*.json ./shared/
RUN cd shared && npm ci --only=production --silent

# Copy package files for user service
COPY user-service/package*.json ./
RUN npm ci --only=production --silent && npm cache clean --force

# Stage 2: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Copy shared library
COPY shared/ ./shared/
COPY --from=deps /app/shared/node_modules ./shared/node_modules

# Build shared library
RUN cd shared && npm run build

# Copy user service files
COPY user-service/package*.json ./
COPY user-service/tsconfig.json ./
COPY --from=deps /app/node_modules ./node_modules

# Copy source code and migrations
COPY user-service/src/ ./src/
COPY user-service/migrations/ ./migrations/

# Build the application
RUN npm run build:prod

# Stage 2: Production
FROM node:18-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies (including sequelize-cli for migrations)
RUN npm ci --only=production --silent && \
    npm cache clean --force

# Copy built application and migrations from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/migrations ./migrations

# Set environment variables
ENV NODE_ENV=production
ENV USER_SERVICE_PORT=3001

# Expose port
EXPOSE 3001

# Switch to non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start the application
CMD ["node", "dist/server.js"]
