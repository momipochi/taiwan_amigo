# backend build
FROM node:18-alpine AS backend-build
WORKDIR /backend-nestjs
COPY    backend-nestjs ./
RUN npm ci
RUN     npm run build

        

# frontend build
FROM node:latest AS frontend-build

WORKDIR /
COPY frontend-vue ./
RUN npm i
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist /usr/share/nginx/html