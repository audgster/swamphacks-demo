FROM node:11.6-slim

WORKDIR /usr/src

COPY package.json /usr/src/package.json

RUN npm install

COPY index.js /usr/src/index.js

ENV NODE_ENV=production

ENTRYPOINT [ "node", "/usr/src/index.js" ]