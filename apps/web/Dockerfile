ARG BUN_VERSION=1

# Base image used by all stages
FROM oven/bun:${BUN_VERSION}-alpine AS builder-base

WORKDIR /space

# Disable Next.js telemetry by default
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

# === Dependencies stage ===
FROM builder-base AS deps
# copy dependency-related files
COPY package.json ./

COPY bun.lock* bun.lockb* ./
# Install dependencies (use --frozen-lockfile if lockfile exists)
RUN bun install
# RUN sh -c 'if test -f bun.lockb || test -f bun.lock; then bun install --frozen-lockfile; else bun install; fi'
# === Build stage ===
FROM builder-base AS builder

ENV NEXT_PUBLIC_BUILD_OUTPUT="standalone" \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

WORKDIR /space

# Copy source and previously installed dependencies
COPY . .
COPY --from=deps /space/node_modules ./node_modules
# Build the Next.js app (standalone output)
RUN bun run --filter './apps/web' build

# === Pruned dependencies stage ===
FROM builder-base AS deps-prod

COPY --from=deps ./package.json ./
# Copy lockfiles from deps stage if they exist
COPY --from=deps ./bun.lock* ./bun.lockb* ./

# Install only production dependencies for smaller runtime image
RUN bun install --production
# RUN sh -c 'if test -f bun.lockb || test -f bun.lock; then bun install --frozen-lockfile --production; else bun install --production; fi'

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

# Copy only the necessary build artifacts
COPY --from=builder --chown=nextjs:nodejs /space/apps/web/build/public ./public
COPY --from=builder --chown=nextjs:nodejs /space/apps/web/build/standalone ./
COPY --from=builder --chown=nextjs:nodejs /space/apps/web/build/static ./build/static

# Copy production dependencies for better performance
COPY --from=deps-prod --chown=nextjs:nodejs /space/node_modules ./node_modules

USER nextjs

EXPOSE 3000

# Use Bun to run the Next.js server for better performance
CMD ["bun", "run", "server.js"]