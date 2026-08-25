FROM node:20-alpine AS builder
WORKDIR /app

# Copy package manifests
COPY package*.json ./
COPY packages/core-types/package*.json ./packages/core-types/
COPY services/api/package*.json ./services/api/

# Install dependencies
RUN npm install

# Copy source files
COPY packages/core-types ./packages/core-types
COPY services/api ./services/api

# Build TypeScript packages
RUN npm run build --workspace=packages/core-types
RUN npm run build --workspace=services/api

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/core-types ./packages/core-types
COPY --from=builder /app/services/api/dist ./services/api/dist
COPY --from=builder /app/services/api/package.json ./services/api/package.json

EXPOSE 8080
CMD ["node", "services/api/dist/index.js"]
