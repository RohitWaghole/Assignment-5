FROM node:alpine

WORKDIR /index

COPY package*.json .

RUN npm ci

COPY . .

CMD ["npm", "run", "dev"]