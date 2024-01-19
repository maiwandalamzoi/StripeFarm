FROM python:3.13.0a3-alpine

COPY . /app
WORKDIR /app

# Required library for cryptography
RUN apk add --no-cache libressl-dev musl-dev libffi-dev

# Required library for psycopg2
RUN apk update && apk add postgresql-dev gcc python3-dev musl-dev

RUN apk add --update \
  && pip install --upgrade pip  \
  && pip install -r requirements.txt \
  && rm -rf /var/cache/apk/*

ENV POSTGRES_PW supersecretpassword

ENTRYPOINT [ "python" ]
CMD [ "main.py" ]