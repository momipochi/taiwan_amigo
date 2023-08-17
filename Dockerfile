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
