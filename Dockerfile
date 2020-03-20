FROM node:13-buster

RUN apt-get update && \
    apt-get install -y dumb-init && \
    rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json /game/

WORKDIR /game
RUN npm install

ENV PATH=/game/node_modules/.bin:$PATH

COPY capacitor.config.json ionic.config.json tsconfig.json /game/
COPY public /game/public
COPY src /game/src

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["ionic", "serve", "--host", "0.0.0.0", "--port", "8100"]
