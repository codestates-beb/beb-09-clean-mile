FROM node:16.14.2-alpine3.15

WORKDIR /usr/src/app

RUN apk update && apk add python3 make g++

COPY package*.json ./

RUN npm config set cache-min 9999999

RUN npm install

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]