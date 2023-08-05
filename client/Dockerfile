FROM node:16.14.2-alpine3.15 AS base

FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN rm -rf ./.next/cache

FROM base AS builder

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules

COPY . .

RUN npm run build

FROM base AS runner

WORKDIR /usr/src/app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs

RUN adduser --system --uid 1001 nextjs

USER nextjs

COPY --from=builder /usr/src/app/public ./public

COPY --from=builder /usr/src/app/.next/standalone ./

COPY --from=builder /usr/src/app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]