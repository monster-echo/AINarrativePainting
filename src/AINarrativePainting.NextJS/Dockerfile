# Build stage
FROM node:20-alpine AS builder
# Install pnpm
RUN npm install -g pnpm
WORKDIR /app
# Copy package files
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
# Copy project files
COPY . .
# Build application
RUN pnpm build

# Production stage
FROM node:20-alpine AS runner
# Install pnpm
RUN npm install -g pnpm
WORKDIR /app
# Copy built application from builder stage
COPY --from=builder /app/package*.json /app/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copy appdata
COPY --from=builder /app/appdata ./appdata

# Add runtime configuration
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["pnpm", "start"]