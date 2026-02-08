ARG BUN_VERSION=1

# Base image used by all stages
FROM oven/bun:${BUN_VERSION}-alpine AS builder-base
WORKDIR /usr/src/docker
# === Dependencies stage ===
FROM builder-base AS deps
# Declare environment variables for the stage
ENV NEXT_PUBLIC_BUILD_OUTPUT="standalone" \
    NEXT_TELEMETRY_DISABLED=1
# Copy workspace root and package files
COPY package.json bun.lock* ./
# Install dependencies
RUN bun install --frozen-lockfile || bun install
# === Production Dependencies ===
FROM builder-base AS install
# Declare environment variables for the stage
ENV NEXT_PUBLIC_BUILD_OUTPUT="standalone" \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production
# copy package files to temp directory for production install
COPY --from=deps /usr/src/docker/package.json /usr/src/docker/bun.lock* ./
# Install only production dependencies for smaller runtime image
RUN bun install -p --frozen-lockfile
# === Build stage ===
FROM builder-base AS builder
# Declare environment variables for the stage
ENV NEXT_PUBLIC_BUILD_OUTPUT="standalone" \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production
# Copy all source files
COPY . .
# Copy pre-installed node_modules from deps stage
COPY --from=deps /usr/src/docker/node_modules ./node_modules
# Build the app workspace
RUN bun run build
# === Runtime stage ===
FROM oven/bun:${BUN_VERSION}-alpine AS runner

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_SITE_URL="http://localhost:3000" \
    NEXT_PUBLIC_SUPABASE_URL="https://gilqgzjkzkmhbbcqidqb.supabase.co" \
    HOSTNAME="0.0.0.0" \
    PORT=3000

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

WORKDIR /app
# Ensure prerender cache directory exists and is writable
RUN mkdir -p build && \
    chown nextjs:nodejs build && \
    chmod 755 build
# Copy only the necessary build artifacts from the app workspace
COPY --from=builder --chown=nextjs:nodejs /usr/src/docker/public ./public
COPY --from=builder --chown=nextjs:nodejs /usr/src/docker/build/standalone ./
COPY --from=builder --chown=nextjs:nodejs /usr/src/docker/build/static ./build/static
# Copy production node_modules (includes all workspace dependencies)
COPY --from=install --chown=nextjs:nodejs /usr/src/docker/node_modules ./node_modules
USER nextjs
# Expose the listening port
EXPOSE 3000
# Start the Next.js server
CMD ["bun", "run", "server.js"]