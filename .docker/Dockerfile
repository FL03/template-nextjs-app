ARG BUN_VERSION=1

# base image used by all stages
FROM oven/bun:${BUN_VERSION} AS builder-base

# ensure the workspace directory exists
RUN mkdir -p /usr/src/app
# set the working directory to the app workspace
WORKDIR /usr/src/app

# Stage 1: Install build dependencies
FROM builder-base AS deps
# make the installation of dependencies a separate step to leverage Docker caching
RUN mkdir -p /tmp/dev
# copy the necessary package files to a temporary directory for installing dependencies
COPY package.json bun.lock* /tmp/dev/
# install the dependencies
RUN cd /tmp/dev && \
    bun install --frozen-lockfile || bun install

# Stage 2: Install dependencies for the production image
FROM builder-base AS deps-prod
# create a temporary directory for production dependencies
RUN mkdir -p /tmp/prod
# copy package files to temp directory for production install
COPY package.json bun.lock* /tmp/prod/
# install production dependencies only
RUN cd /tmp/prod && \
    bun install --frozen-lockfile --production || bun install --production

# Stage 3: Build Stage
FROM builder-base AS builder

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_BUILD_OUTPUT="standalone"
# set the working directory to the app workspace
WORKDIR /usr/src/app
# copy dependencies from the deps stage to the builder stage
COPY --from=deps /tmp/dev/node_modules ./
# copy source files to the builder stage
COPY . .
# build the workspace
RUN bun run build

# === Runtime Base ===
FROM oven/bun:${BUN_VERSION}-alpine AS runner-base

# Create non-root user
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 ausr
# configure the working directory for the runtime stage
WORKDIR /usr/src/app
# Ensure prerender cache directory exists and is writable
RUN mkdir -p build && \
    chown ausr:appgroup build && \
    chmod 755 build

# Copy build artifacts from the app workspace
COPY --from=builder --chown=ausr:appgroup /usr/src/app/public ./public
COPY --from=builder --chown=ausr:appgroup /usr/src/app/build/standalone ./
COPY --from=builder --chown=ausr:appgroup /usr/src/app/build/static ./build/static

# Copy production node_modules
COPY --from=install --chown=ausr:appgroup /tmp/prod/node_modules ./node_modules

FROM runner-base AS runner

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_SITE_URL="http://localhost:3000" \
    NEXT_PUBLIC_SUPABASE_URL="https://gilqgzjkzkmhbbcqidqb.supabase.co" \
    HOSTNAME="0.0.0.0" \
    PORT=3000

USER ausr

EXPOSE 3000/tcp

CMD ["bun", "run", "server.js"]
