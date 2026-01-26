# ARG Stage: Base Image
ARG BUN_VERSION=1

# Stage 1: Base Layer
FROM oven/bun:${BUN_VERSION}-alpine AS builder-base
WORKDIR /space

# Disable Next.js telemetry by default
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

# Stage 2: Dependency Installation
FROM builder-base AS deps

# Only copy dependency-related files from the monorepo
ADD package.json bun.lock* bun.lockb* ./

# Install dependencies with workspace awareness
RUN bun workspaces install --frozen-lockfile || bun install
# Alternatively, force workspace-specific install:
# RUN sh -c 'bun install --frozen-lockfile || bun install'

# Stage 3: Build Layer
FROM builder-base AS builder
WORKDIR /space

# Copy all source files from the monorepo
COPY . .

# Copy dependencies from deps stage
COPY --from=deps /space/node_modules ./node_modules

# Build the Next.js application at apps/web
WORKDIR /space/apps/web
RUN bun run --filter './apps/web/' build

# Stage 4: Runtime Layer
FROM oven/bun:${BUN_VERSION}-alpine AS runner
WORKDIR /app

# Set environment variables - customize these for production!
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME="0.0.0.0" \
    PORT=3000

# Set nextjs non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Setup working directory for the app
RUN mkdir -p build && \
    chown nextjs:nodejs build && \
    chmod 755 build

# Copy built artifacts into the runtime image
COPY --from=builder --chown=nextjs:nodejs /space/apps/web/build/public ./public
COPY --from=builder --chown=nextjs:nodejs /space/apps/web/build/standalone ./
COPY --from=builder --chown=nextjs:nodejs /space/apps/web/build/static ./build/static

# Ensure production dependencies exist (if applicable)
COPY --from=deps --chown=nextjs:nodejs /space/node_modules ./node_modules

USER nextjs
EXPOSE 3000

# Use Bun for serving
CMD ["bun", "run", "server.js"]