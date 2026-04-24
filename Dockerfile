FROM node:20-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
RUN npx playwright install chromium --with-deps

FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /root/.cache/ms-playwright /root/.cache/ms-playwright
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/worker ./worker
COPY --from=build /app/src ./src
EXPOSE 3000
CMD ["npx", "concurrently", "-k", "-n", "web,worker", "next start", "tsx worker/index.ts"]
