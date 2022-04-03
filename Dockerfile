FROM node:lts-alpine

WORKDIR /opt

ADD ./build .

RUN npm i

CMD ["node", "server.js"]