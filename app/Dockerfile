FROM node:20

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN mkdir log

RUN chown -R node:node /usr/src/app/log /usr/src/app/uploads /usr/src/app/public/thumbnail

RUN npm install --production && npm run pro-build

USER node

CMD ["node", "dist/server.js", "output-log"]