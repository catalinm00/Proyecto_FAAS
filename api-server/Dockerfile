FROM node:iron-slim
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN apt-get update -y && apt-get install -y openssl  \
    && npm run prisma:generate && npm run build


CMD [ "npm", "run", "start:prod" ]
