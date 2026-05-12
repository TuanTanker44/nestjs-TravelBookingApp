FROM node:20-alpine AS builder

ARG APP_NAME=travel-booking-app

WORKDIR /app

# Install native build tools required by some Node dependencies.
RUN apk add --no-cache python3 make g++

# Cache dependency install separately from source copy.
COPY package*.json ./
COPY nest-cli.json tsconfig*.json ./
COPY apps ./apps
COPY libs ./libs

RUN npm ci

# Build a single Nest application from the monorepo.
RUN npm run build -- ${APP_NAME}

FROM node:20-alpine AS runner

ARG APP_NAME=travel-booking-app
ARG PORT=3000

WORKDIR /app
ENV NODE_ENV=production
ENV APP_NAME=${APP_NAME}
ENV PORT=${PORT}

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE ${PORT}

# Run the compiled output for the selected app.
CMD ["sh", "-c", "node dist/apps/${APP_NAME}/main"]
