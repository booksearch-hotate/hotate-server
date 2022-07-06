FROM node:16

COPY . .

RUN npm install --production && npm run pro-build

CMD ["node", "dist/server.js", "output-log"]