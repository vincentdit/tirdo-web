# Strapi 5 production image.
# Debian slim is used (not Alpine) because sharp, pg and Strapi's build tools
# ship prebuilt binaries for glibc — no compiler toolchain needed, so the
# image builds fast and reliably.
FROM node:20-bookworm-slim
ENV NODE_ENV=production
WORKDIR /opt/app

# Minimal runtime libs only (TLS). No build-base / vips needed.
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .
# Build the admin panel (no external network needed at build time)
RUN npm run build

EXPOSE 1337
CMD ["npm", "run", "start"]
