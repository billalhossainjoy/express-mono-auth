# -----------------------------
# Stage 1: Base dependencies
# -----------------------------
FROM node:20-alpine AS base

WORKDIR /usr/src/app

# Install system dependencies
RUN apk add --no-cache openssl

# Install pnpm globally
RUN npm install -g pnpm

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install dependencies (for all environments)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# -----------------------------
# Stage 2: Development
# -----------------------------
FROM base AS development

ENV NODE_ENV=development

# Generate Prisma client
RUN pnpm dlx prisma generate

EXPOSE 5000

CMD ["pnpm", "run", "dev"]


# -----------------------------
# Stage 3: Build for production
# -----------------------------
FROM base AS build

ENV NODE_ENV=production

# Generate Prisma client
RUN pnpm dlx prisma generate

# Build the app (if using TypeScript or a build step)
RUN pnpm run build


# -----------------------------
# Stage 4: Production runtime
# -----------------------------
FROM node:20-alpine AS production

WORKDIR /usr/src/app

RUN apk add --no-cache openssl

RUN npm install -g pnpm

# Copy only needed files from build
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copy built app and Prisma client
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma

ENV NODE_ENV=production

EXPOSE 5000

CMD ["pnpm", "run", "start"]
