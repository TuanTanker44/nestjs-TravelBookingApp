# =========================
# Builder Stage
# =========================
FROM node:24-alpine AS builder

ARG APP_NAME=travel-booking-app

WORKDIR /app

# Native build tools
RUN apk add --no-cache python3 make g++

# Enable pnpm
RUN corepack enable

# Copy dependency files trước để tận dụng cache
COPY package.json pnpm-lock.yaml ./
COPY nest-cli.json tsconfig*.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps ./apps
COPY libs ./libs

# Build app
RUN pnpm run build -- ${APP_NAME}

# Chỉ giữ production dependencies
RUN pnpm prune --prod

# =========================
# Runner Stage
# =========================
FROM node:24-alpine AS runner

ARG APP_NAME=travel-booking-app
ARG PORT=3000

WORKDIR /app

ENV NODE_ENV=production
ENV APP_NAME=${APP_NAME}
ENV PORT=${PORT}

# Enable pnpm (không bắt buộc nếu chỉ chạy node)
RUN corepack enable

# Copy production dependencies từ builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copy build output
COPY --from=builder /app/dist ./dist

EXPOSE ${PORT}

CMD ["sh", "-c", "node dist/apps/${APP_NAME}/main"]