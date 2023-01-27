# builder
FROM --platform=linux/amd64 node:18-alpine as builder

COPY package.json yarn.lock ./
COPY ./prisma ./

RUN apk add --no-cache \
  yarn \
  bash \
  openssl

RUN yarn 

COPY . . 

RUN yarn prisma generate
RUN yarn build

# app
FROM --platform=linux/amd64 node:18-alpine as app

WORKDIR /app

RUN yarn global add pm2

COPY --from=builder ./node_modules ./node_modules
COPY --from=builder ./process.yml .
COPY --from=builder ./dist .
COPY --from=builder ./prisma .

EXPOSE 3333

CMD ["pm2-runtime", "process.yml"]