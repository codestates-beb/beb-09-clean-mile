FROM node:16.14.2-alpine3.15

WORKDIR /usr/src/app

RUN apk update && apk add python3 make g++

COPY package*.json ./

RUN npm install

COPY src ./src

ENV NODE_ENV=dev

CMD [ "npm", "start" ]