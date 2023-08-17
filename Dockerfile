# backend build
FROM node:18-alpine AS backend-build
WORKDIR /
COPY backend-nestjs backend-nestjs
RUN npm ci
RUN npm run build

        

# frontend build
FROM node:latest AS frontend-build
WORKDIR /
COPY frontend-vue frontend-vue
RUN npm i
RUN npm run build

COPY --from=backend-build \
    /usr/src/app/node_modules ./node_modules \
   /usr/src/app/dist ./dist

COPY --from=frontend-build \
    /app/dist /usr/share/nginx/html \
    nginx.conf /etc/nginx/conf.d/

CMD [ "node", "dist/main.js" ]