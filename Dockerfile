FROM node:20-alpine

RUN apk add --no-cache --virtual .build-deps \
    alpine-sdk \
    python3

WORKDIR /app

COPY package.json yarn.lock ./

COPY prisma ./prisma/

RUN yarn install --frozen-lockfile

RUN yarn generate

COPY . .

# Build the application for production
RUN yarn build

# Run database migrations (if needed)
# RUN yarn migrate:prod

EXPOSE 3001

# Use production start command
CMD ["yarn", "start:prod"]
