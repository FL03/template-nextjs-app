ARG BUN_VERSION=1

# base image used by all stages
FROM oven/bun:${BUN_VERSION} AS builder-base
WORKDIR /usr/src/app

# === Install all dependencies (cached unless package files change) ===
FROM builder-base AS install
COPY package.json bun.lock* ./
COPY app/package.json ./app/
RUN bun install --frozen-lockfile || bun install

# === Install production dependencies only ===
FROM builder-base AS install-prod
COPY package.json bun.lock* ./
COPY app/package.json ./app/
RUN bun install --frozen-lockfile --production || bun install --production

# === Build the Next.js app ===
FROM builder-base AS builder
COPY --from=install /usr/src/app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_BUILD_OUTPUT="standalone" \
RUN cd app && next build

# === Runtime ===
FROM oven/bun:${BUN_VERSION}-alpine AS runner

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_SITE_URL="http://localhost:3000" \
    NEXT_PUBLIC_SUPABASE_URL="https://gilqgzjkzkmhbbcqidqb.supabase.co" \
    HOSTNAME="0.0.0.0" \
    PORT=3000

# Create non-root user
RUN addgroup --system --gid 1001 apg && \
    adduser --system --uid 1001 ausr

WORKDIR /app

# Ensure prerender cache directory exists and is writable
RUN mkdir -p build && \
    chown ausr:apg build && \
    chmod 755 build

# Copy build artifacts from the app workspace
COPY --from=builder --chown=ausr:apg /usr/src/app/app/public ./public
COPY --from=builder --chown=ausr:apg /usr/src/app/app/build/standalone ./
COPY --from=builder --chown=ausr:apg /usr/src/app/app/build/static ./build/static

# Copy production node_modules
COPY --from=install-prod --chown=ausr:apg /usr/src/app/node_modules ./node_modules

USER ausr
EXPOSE 3000/tcp
CMD ["bun", "run", "server.js"]
