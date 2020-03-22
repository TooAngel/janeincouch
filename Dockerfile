ARG NODE_IMAGE=node:13-buster
ARG NGINX_IMAGE=nginx:1.16-alpine

#
#
# Dev
FROM ${NODE_IMAGE} AS dev

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

#
#
# Build
FROM dev AS build

RUN ionic build

#
#
# Dist
FROM ${NGINX_IMAGE}

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /game/build /www
