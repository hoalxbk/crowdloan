FROM node:12-alpine
ENV DOCKERIZE_VERSION v0.5.0
RUN mkdir /code \
    && apk update && apk add curl make gcc g++ \
    && curl -L https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz | tar -C /usr/local/bin -xzv 

WORKDIR /code
COPY . ./
RUN cp .env.prod .env \
    && npm install -g typescript@4.0.2 \
    && npm install \
    && make all \
    &&  npm cache clean --force \
    && chmod +x start.sh

CMD [ "./start.sh" ]
