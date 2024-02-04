FROM node:18

COPY . .

RUN npm install --production && npm run pro-build && npm install -g sequelize-cli

CMD ["node", "dist/server.js", "output-log", "use-aws-es"]