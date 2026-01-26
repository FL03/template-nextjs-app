ARG BUN_VERSION=1

# Base image used by all stages
FROM oven/bun:${BUN_VERSION}-alpine AS builder-base

WORKDIR /app

# Disable Next.js telemetry by default
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production
# === Dependencies stage ===
FROM builder-base AS deps
# Copy dependency related files
COPY package.json bun.lock* bun.lockb* ./
# Install dependencies (use --frozen-lockfile if lockfile exists)
RUN bun install --frozen-lockfile || bun install

# === Build stage ===
FROM builder-base AS builder

ENV NEXT_PUBLIC_BUILD_OUTPUT="standalone" \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

WORKDIR /app

# copy source files
COPY . .
# copy pre-installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
# build the app
RUN bun run build

# === Pruned dependencies stage ===
FROM builder-base AS deps-prod
# copy dependency related files from deps stage
# to gaurentee consistency between stages
COPY --from=deps /app/package.json /app/bun.lock* /app/bun.lockb* ./
# Install only production dependencies for smaller runtime image
RUN bun install --production --frozen-lockfile

# === Runtime stage ===
FROM oven/bun:${BUN_VERSION}-alpine AS runner

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_BUILD_OUTPUT="standalone" \
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

# Copy only the necessary build artifacts
COPY --from=builder --chown=nextjs:nodejs /app/build/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/build/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/build/static ./build/static

# Copy production dependencies for better performance
COPY --from=deps-prod --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs
# expose the listening port
EXPOSE 3000
# use bun to run the server
CMD ["bun", "run", "server.js"]