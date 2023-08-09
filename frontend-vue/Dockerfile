FROM node:latest as build-stage
WORKDIR /app
COPY package.json ./
RUN npm i
RUN npm install -g npm
RUN npm install -g @vue/cli
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/