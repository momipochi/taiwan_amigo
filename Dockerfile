# backend build
FROM node:18-alpine AS backend-build

WORKDIR /
COPY    backend-nestjs ./backend-nestjs
RUN     npm ci && npm run build

# frontend build
FROM node:latest AS frontend-build

WORKDIR /
COPY frontend-vue ./frontend-vue
RUN \
    npm i && \
    npm run build

#
# final stage:
#
FROM scratch

COPY --from=backend-build \
    /backend-nestjs/dist \
    /app/dist/

COPY --from=frontend-build \
    /frontend-vue/dist \
    /app/dist/

CMD ["/app/rest-server"]