FROM node:18

WORKDIR /home/node/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run clean
RUN npm run ourcompile
RUN npm run distclean

CMD ["npm", "start"]
