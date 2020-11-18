from node:12.19.1-alpine3.12 as build
run apk add --no-cache autoconf automake g++ libtool libpng-dev make nasm

copy package.json package-lock.json /build/

workdir /build
run npm install
env PATH="/build/node_modules/.bin:$PATH"

copy gatsby-browser.js gatsby-config.js /build/
copy src /build/src
run gatsby build


from nginx:1.19
run rm -r /usr/share/nginx/html/*
copy --from=build /build/public/ /usr/share/nginx/html/
