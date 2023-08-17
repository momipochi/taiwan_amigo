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

#
# final stage:
#
FROM scratch



COPY --from=backend-build \
   ./dist \
    ./node_modules

COPY --from=frontend-build \
    /usr/share/nginx/html \
    /app/dist


# Start the server using the production build
CMD [ "node", "dist/main.js" ]