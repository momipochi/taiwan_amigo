# backend build
FROM node:18-alpine AS backend-build
WORKDIR /
COPY backend-nestjs backend-nestjs
RUN npm i
RUN npm run build

        

# frontend build
FROM node:latest AS frontend-build
WORKDIR /
COPY frontend-vue frontend-vue
RUN npm i
RUN npm run build


FROM scratch
COPY --from=backend-build /backend-nestjs/node_modules ./node_modules
COPY --from=backend-build /backend-nestjs/dist ./dist


COPY --from=frontend-build /frontend-vue/dist /usr/share/nginx/html
COPY --from=frontend-build nginx.conf /etc/nginx/conf.d/

CMD [ "node", "dist/main.js" ]