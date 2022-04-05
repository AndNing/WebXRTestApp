FROM python:3.10-buster
WORKDIR /app

COPY ./app ./app
COPY ./requirements.txt ./app.py ./schema.sql ./init_db.py ./
RUN pip install -r ./requirements.txt

# RUN apt-get -y install sudo
RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y sqlite3 libsqlite3-dev

RUN python init_db.py

EXPOSE 5000
CMD ["gunicorn", "-b", ":5000", "app:app"]