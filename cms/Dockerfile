# Strapi 5 production image.
# Debian slim is used (not Alpine) because sharp, pg and Strapi's build tools
# ship prebuilt binaries for glibc — no compiler toolchain needed, so the
# image builds fast and reliably.
FROM node:20-bookworm-slim
ENV NODE_ENV=production
WORKDIR /opt/app

# Minimal runtime libs only (TLS). No build-base / vips needed.
# curl fetches the sharp libvips binary with retries; sharp's own download
# gives up after about 60 seconds, which fails on a slow link to GitHub.
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates curl \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /root/.npm/_libvips \
    && curl -fL --retry 12 --retry-all-errors --retry-delay 5 --connect-timeout 30 \
      -o /tmp/libvips-8.14.5-linux-x64.tar.br \
      https://github.com/lovell/sharp-libvips/releases/download/v8.14.5/libvips-8.14.5-linux-x64.tar.br \
    && mv /tmp/libvips-8.14.5-linux-x64.tar.br /root/.npm/_libvips/libvips-8.14.5-linux-x64.tar.br

COPY package.json package-lock.json* ./
RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm config set fetch-timeout 600000 \
    && i=1 \
    && while [ "$i" -le 5 ]; do \
      npm install --legacy-peer-deps && exit 0; \
      echo "npm install failed, attempt ${i}"; \
      i=$((i + 1)); \
      sleep 20; \
    done \
    && exit 1

COPY . .
# Build the admin panel (no external network needed at build time)
RUN npm run build

EXPOSE 1337
CMD ["npm", "run", "start"]
