# Imagem do front. O stack completo (db + api + web) sobe pelo
# docker-compose.yml em argos-api (os dois repositórios devem ser irmãos).
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/argos-web/browser /usr/share/nginx/html
EXPOSE 80
