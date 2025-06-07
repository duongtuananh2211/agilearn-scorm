# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN \
  if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
  else echo "No lockfile found." && exit 1; fi

# Copy all necessary files for build
COPY . .

# Build the Next.js app
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN \
  if [ -f package-lock.json ]; then npm ci --omit=dev --legacy-peer-deps; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile --production; \
  elif [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile --prod; \
  else echo "No lockfile found." && exit 1; fi

# Copy built app and public assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["npm", "start"]
