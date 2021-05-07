#STEP 1 BUILD VUE PROJECT
# docker buildx build --platform linux/arm/v7 -t kallakukku/hue-app:latest --push .
FROM node:14-alpine AS build
WORKDIR /app
COPY package.json ./
RUN apk add --no-cache python2
RUN apk add --no-cache build-base
RUN npm install
COPY . .
RUN npm run build

#STEP 2 CREATE NGINX SERVER
FROM nginx:1.19.0-alpine AS prod-stage
COPY --from=build /app/dist /usr/share/nginx/html
COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

EXPOSE 80
ENTRYPOINT [ "/entrypoint.sh" ]

#CMD ["nginx","-g","daemon off;"]