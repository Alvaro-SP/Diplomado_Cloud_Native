FROM node:18.14.0-buster-slim as compilacion

LABEL developer="Grupo 1 Software Avanzado"

# Copy app
COPY . /opt/app

WORKDIR /opt/app

# Npm install
RUN npm install

RUN npm run build

# Fase 2
FROM nginx:1.22.1-alpine as runner

COPY --from=compilacion /opt/app/build /usr/share/nginx/html
