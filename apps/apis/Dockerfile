FROM node:22 AS builder

# Create app directory
WORKDIR /app

RUN npm install -g @nestjs/cli

# Enable pnpm
RUN npm i -g corepack@latest
RUN corepack enable

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY tsconfig*.json .
# COPY prisma ./prisma/

# Install app dependencies
RUN yarn install

COPY . .

RUN yarn run build

FROM node:22

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/tsconfig*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./.env

CMD ["yarn", "run", "start" ]
