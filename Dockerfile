FROM node:22 AS builder

ARG APP_NAME

# Create app directory
WORKDIR /app

ARG MICRO_SERVICE_PATH=apps/$APP_NAME

RUN npm install -g @nestjs/cli

# Enable pnpm
RUN npm i -g corepack@latest
RUN corepack enable

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY tsconfig*.json .
COPY .yarn .yarn
COPY yarn.lock .
COPY .yarnrc.yml .

COPY . .

# COPY prisma ./prisma/
# Install app dependencies
RUN yarn install

RUN yarn workspace $APP_NAME build

FROM node:22

ARG APP_NAME

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/$APP_NAME/package*.json ./
COPY --from=builder /app/apps/$APP_NAME/tsconfig*.json ./
COPY --from=builder /app/apps/$APP_NAME/dist ./dist
COPY --from=builder /app/apps/$APP_NAME/.env ./.env

CMD ["yarn", "run", "start" ]
