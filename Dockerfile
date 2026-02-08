ARG BUN_VERSION=1

# Base image used by all stages
FROM oven/bun:${BUN_VERSION}-alpine AS builder-base

WORKDIR /src

# Disable Next.js telemetry by default
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

# === Dependencies stage ===
FROM builder-base AS deps

WORKDIR /src

# Copy workspace root and package files
COPY package.json bun.lock* bun.lockb* ./

# Copy workspace package files
COPY app/package.json ./app/package.json

# Install dependencies (respects bun workspace setup)
RUN bun install --frozen-lockfile || bun install

# === Build stage ===
FROM builder-base AS builder

ENV NEXT_PUBLIC_BUILD_OUTPUT="standalone" \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

WORKDIR /src

# Copy all source files
COPY . .

# Copy pre-installed node_modules from deps stage
COPY --from=deps /src/node_modules ./node_modules

# Build the app workspace
RUN bun run build

# === Pruned dependencies stage ===
FROM builder-base AS deps-prod

# Copy workspace root and package files to ensure consistency
COPY --from=deps /src/package.json /src/bun.lock* /src/bun.lockb* ./
COPY --from=deps /src/app/package.json ./app/package.json

# Install only production dependencies for smaller runtime image
RUN bun install --production --frozen-lockfile

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
COPY --from=builder --chown=nextjs:nodejs /src/app/public ./public
COPY --from=builder --chown=nextjs:nodejs /src/app/build/standalone ./
COPY --from=builder --chown=nextjs:nodejs /src/app/build/static ./build/static

# Copy production node_modules (includes all workspace dependencies)
COPY --from=deps-prod --chown=nextjs:nodejs /src/node_modules ./node_modules

USER nextjs

# Expose the listening port
EXPOSE 3000

# Start the Next.js server
CMD ["bun", "run", "server.js"]