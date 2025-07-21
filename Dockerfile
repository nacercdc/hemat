FROM node:22-alpine AS base

RUN apk update && \
  apk upgrade && \
  apk add --no-cache dumb-init && \
  rm -rf /var/cache/apk/* && \
  corepack enable && \
  corepack prepare yarn@4.5.0 --activate && \
  addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

FROM base AS deps

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY apps ./apps
COPY packages ./packages
COPY tooling ./tooling
COPY scripts ./scripts

RUN yarn install

FROM base AS builder

ARG APP_NAME

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/yarn.lock ./yarn.lock
COPY --from=deps /app/.yarnrc.yml ./.yarnrc.yml
COPY --from=deps /app/.yarn ./.yarn

COPY --from=deps /app/apps/ ./apps/
COPY --from=deps /app/packages/ ./packages/
COPY --from=deps /app/tooling/ ./tooling/
COPY --from=deps /app/scripts/ ./scripts/
COPY --from=deps /app/apps/${APP_NAME}/.env.stg ./apps/${APP_NAME}/.env

RUN yarn workspace ${APP_NAME} build

FROM base AS web-runner

ARG APP_NAME

WORKDIR /app

COPY --from=builder --chown=nestjs:nodejs /app/apps/${APP_NAME}/.next/standalone/apps ./apps
COPY --from=builder --chown=nestjs:nodejs /app/apps/${APP_NAME}/.next/standalone/packages ./packages
COPY --from=builder --chown=nestjs:nodejs /app/apps/${APP_NAME}/.next/standalone/package.json ./
COPY --from=builder --chown=nestjs:nodejs /app/apps/${APP_NAME}/public ./apps/${APP_NAME}/public
COPY --from=builder --chown=nestjs:nodejs /app/apps/${APP_NAME}/.next/static ./apps/${APP_NAME}/.next/static

COPY --from=builder --chown=nestjs:nodejs /app/packages/ ./packages/
COPY --from=builder --chown=nestjs:nodejs /app/tooling/ ./tooling/
COPY --from=builder --chown=nestjs:nodejs /app/scripts/ ./scripts/

RUN yarn workspaces focus ${APP_NAME} --production

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV APP_NAME=$APP_NAME

ENTRYPOINT ["dumb-init", "--"]

CMD ["sh", "-c", "yarn workspace \"$APP_NAME\" start"]

FROM base AS service-runner

ARG APP_NAME

WORKDIR /app

COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nestjs:nodejs /app/yarn.lock ./yarn.lock
COPY --from=builder --chown=nestjs:nodejs /app/.yarnrc.yml ./.yarnrc.yml
COPY --from=builder --chown=nestjs:nodejs /app/.yarn ./.yarn

COPY --from=builder --chown=nestjs:nodejs /app/apps/${APP_NAME}/ ./apps/${APP_NAME}

COPY --from=builder --chown=nestjs:nodejs /app/packages/ ./packages/
COPY --from=builder --chown=nestjs:nodejs /app/tooling/ ./tooling/
COPY --from=builder --chown=nestjs:nodejs /app/scripts/ ./scripts/

RUN npm install -g @nestjs/cli
RUN yarn workspaces focus ${APP_NAME} --production

EXPOSE 8080

ENV PORT=8080
ENV HOSTNAME="0.0.0.0"
ENV APP_NAME=$APP_NAME

ENTRYPOINT ["dumb-init", "--"]

CMD ["sh", "-c", "yarn workspace \"$APP_NAME\" start:prod"]