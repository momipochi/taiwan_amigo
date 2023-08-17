# backend build
FROM node:18-alpine AS backend-build
WORKDIR /
COPY backend-nestjs ./
RUN npm ci
RUN npm run build

        

# frontend build
FROM node:latest AS frontend-build
WORKDIR /
COPY frontend-vue ./
RUN npm i
RUN npm run build

COPY --from=backend-build /usr/src/app/node_modules ./node_modules
COPY --from=backend-build /usr/src/app/dist ./dist


COPY --from=frontend-build /app/dist /usr/share/nginx/html
COPY --from=frontend-build nginx.conf /etc/nginx/conf.d/

CMD [ "node", "dist/main.js" ]