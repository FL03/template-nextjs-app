ARG BUN_VERSION=1

# STAGE 1
# base image used by builder stages
FROM oven/bun:${BUN_VERSION} AS builder-base
# set the working directory for all stages to /usr/src/app
WORKDIR /usr/src/app
# install dependencies into temp directory
# this will cache them and speed up future builds
FROM builder-base AS install

RUN mkdir -p /temp/dev

COPY package.json* bun.lock* /temp/dev/

RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json* bun.lock* /temp/prod/

RUN cd /temp/prod && \
    bun install --frozen-lockfile --production || bun install --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM builder-base AS prerelease

COPY --from=install /temp/dev/node_modules node_modules

COPY . .

# [optional] tests & build
ENV NODE_ENV=production
RUN bun test
RUN bun run build

# copy production dependencies and source code into final image
FROM bun:${BUN_VERSION}-alpine AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/index.ts .
COPY --from=prerelease /usr/src/app/package.json .


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

# Copy only the necessary build artifacts from the app workspace
COPY --from=builder --chown=ausr:apg /usr/src/app/public ./public
COPY --from=builder --chown=ausr:apg /usr/src/app/build/standalone ./
COPY --from=builder --chown=ausr:apg /usr/src/app/build/static ./build/static

# Copy production node_modules (includes all workspace dependencies)
COPY --chown=ausr:apg --from=install /temp/prod/node_modules node_modules

USER ausr
# Expose the listening port
EXPOSE 3000/tcp
# Start the Next.js server
CMD ["bun", "run", "server.js"]