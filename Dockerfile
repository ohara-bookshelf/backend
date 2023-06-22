FROM node:18-alpine3.17 as build
WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "start"]