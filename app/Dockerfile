FROM node:12-slim

COPY . .

RUN npm install --production && npm run build

CMD ["node", "dist/server.js"]