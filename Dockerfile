FROM node:11.6-slim

WORKDIR /usr/src

COPY package.json /usr/src/

# TODO: should use yarn since project uses yarn
# Can use base yarn image with node runtime image
RUN npm install

COPY index.js /usr/src/index.js

ENV NODE_ENV=production

ENTRYPOINT [ "node", "/usr/src/index.js" ]