ARG NODE_IMAGE=node:16-alpine

FROM $NODE_IMAGE AS deps
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM $NODE_IMAGE AS builder
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN yarn build

FROM $NODE_IMAGE AS runner
WORKDIR /app

COPY --from=builder /app/dist/index.js .
COPY src/queries src/queries

ENV FORCE_COLOR 1

CMD [ "node", "index.js" ]