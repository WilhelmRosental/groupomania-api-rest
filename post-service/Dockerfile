# Multi-stage build for Post Service
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production --silent

# Copy source code and migrations
COPY src/ ./src/
COPY migrations/ ./migrations/

# Build the application
RUN npm run build

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

# Create images directory with proper permissions
RUN mkdir -p ./images && chown nodejs:nodejs ./images

# Set environment variables
ENV NODE_ENV=production
ENV POST_SERVICE_PORT=3002

# Expose port
EXPOSE 3002

# Switch to non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3002/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start the application
CMD ["node", "dist/server.js"]
