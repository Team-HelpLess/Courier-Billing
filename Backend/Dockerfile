FROM python:3.10.9-slim-bullseye

RUN apt-get update \
    && apt-get install -y --no-install-recommends --no-install-suggests \
    build-essential default-libmysqlclient-dev \
    && pip3 install --no-cache-dir --upgrade pip

WORKDIR /Backend
COPY ./requirements.txt /Backend/
RUN pip3 install --no-cache-dir -r /Backend/requirements.txt
COPY . /Backend/

EXPOSE 8000

RUN python3 manage.py makemigrations && python3 manage.py migrate && python3 manage.py collectstatic

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
