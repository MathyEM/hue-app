#STEP 1 BUILD VUE PROJECT
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
EXPOSE 80
CMD ["nginx","-g","daemon off;"]