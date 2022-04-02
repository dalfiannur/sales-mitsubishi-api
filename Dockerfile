FROM node:lts-alpine

WORKDIR /opt

ADD ./dist .

RUN npm i

EXPOSE 3333

CMD ["node", "server.js"]