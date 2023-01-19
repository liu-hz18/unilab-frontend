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
RUN npm config set registry https://registry.npm.taobao.org
RUN npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN cnpm install --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/

RUN ls $FRONTEND/node_modules/_codemirror@5.65.3@codemirror -al
COPY ./third_party/codemirror.css $FRONTEND/node_modules/_codemirror@5.65.3@codemirror/lib/codemirror.css
COPY . $FRONTEND
# RUN cnpm run build
RUN cnpm run report
RUN apk del build-dependencies



FROM nginx:latest AS runner
ENV TZ=Asia/Shanghai

COPY --from=builder /unilab-frontend/unilab /usr/share/nginx/html/unilab
RUN chmod -R 777 /usr/share/nginx/html
COPY --from=builder /unilab-frontend/unilab/index.html /etc/nginx/html/index.html
COPY --from=builder /unilab-frontend/unilab/50x.html /etc/nginx/html/50x.html
RUN chmod -R 777 /etc/nginx/html

EXPOSE 80

# docker build -t unilab-frontend-docker .
# docker run --name unilab-frontend -p 80:80 -v /d/unilab-frontend-mount/nginx/logs:/var/log/nginx --link unilab-nginx:unilab-nginx --net unilab-backend_default unilab-frontend-docker
