FROM node:17-alpine as build-step
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./package.json ./package-lock.json ./
COPY ./src ./src
COPY ./public ./public
RUN npm install
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build-step /app/build /usr/share/nginx/html
COPY ./deployment/nginx.default.conf /etc/nginx/conf.d/default.conf