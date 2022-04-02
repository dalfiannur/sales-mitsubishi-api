FROM node:lts-alpine

WORKDIR /opt

ADD ./build .

RUN npm i

EXPOSE 3333

CMD ["node", "server.js"]