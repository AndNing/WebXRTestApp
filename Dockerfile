FROM node:17-alpine as build-step
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./frontend/package.json ./frontend/package-lock.json ./
COPY ./frontend/src ./src
COPY ./frontend/public ./public
RUN npm install
RUN npm run build

FROM python:3.10-buster
WORKDIR /app
COPY --from=build-step /app/build ./build

COPY ./backend/app ./app
COPY ./backend/requirements.txt ./backend/app.py ./backend/schema.sql ./backend/init_db.py ./
RUN pip install -r ./requirements.txt

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y sqlite3 libsqlite3-dev

RUN python init_db.py

EXPOSE 3000
CMD ["gunicorn", "app:app"]
