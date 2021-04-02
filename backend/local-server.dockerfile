FROM node:12-alpine
RUN mkdir /code \
    && apk update && apk add curl
WORKDIR /code
COPY package*.json ./
RUN npm i -g @adonisjs/cli \
    && npm install && npm cache clean --force
COPY . .
RUN cp .env.example .env
EXPOSE 3001
CMD [ "node", "server" ]
