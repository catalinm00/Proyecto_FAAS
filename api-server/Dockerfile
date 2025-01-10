FROM node:alpine
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN apk update && apk add openssl  \
    && npm run prisma:generate && npm run build


CMD [ "npm", "run", "start:prod" ]
