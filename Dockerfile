# backend build
FROM node:18-alpine AS backend-build
WORKDIR /backend-nestjs
COPY    backend-nestjs ./backend-nestjs
RUN     npm run build
        

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


# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=backend-build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=backend-build /usr/src/app/dist ./dist

COPY --from=frontend-build  /app/dist /usr/share/nginx/html
COPY --from=frontend-build nginx.conf /etc/nginx/conf.d/


# Start the server using the production build
CMD [ "node", "dist/main.js" ]