FROM node:alpine AS builder

ENV TZ=Asia/Shanghai
ENV FRONTEND=/unilab-frontend

RUN apk update
RUN apk --no-cache --virtual build-dependencies add python3 make gcc g++ tzdata

RUN cp /usr/share/zoneinfo/${TZ} /etc/localtime \
    && echo ${TZ} > /etc/timezone
RUN python3 --version
RUN npm config set python python3
RUN node --version

WORKDIR $FRONTEND

COPY package.json $FRONTEND
# COPY package-lock.json $FRONTEND
RUN npm config set registry https://registry.npm.taobao.org
RUN npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
RUN npm install
RUN npm rebuild node-sass

COPY . $FRONTEND
RUN npm run build
RUN apk del build-dependencies



FROM nginx:latest AS runner
ENV TZ=Asia/Shanghai

COPY --from=builder /unilab-frontend/dist /usr/share/nginx/html
COPY ./public/50x.html /usr/share/nginx/html/50x.html

EXPOSE 80

# docker build -t unilab-frontend-docker .
# docker run --name unilab-frontend -p 80:80 -v /d/unilab-frontend-mount/nginx/logs:/var/log/nginx --link unilab-nginx:unilab-nginx --net unilab-backend_default unilab-frontend-docker
