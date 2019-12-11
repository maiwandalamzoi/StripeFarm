FROM python:3-alpine

COPY . /app

WORKDIR /app

# Required library for cryptography
RUN apk add --no-cache libressl-dev musl-dev libffi-dev

# Required library for psycopg2
RUN apk update && apk add postgresql-dev gcc python3-dev musl-dev

RUN apk add --update \
  && apk add iproute2 \
  && pip install --upgrade pip  \
  && pip install -r requirements.txt \
  && rm -rf /var/cache/apk/*

ENV POSTGRES_PW supersecretpassword
ENV POSTGRES_PORT 5433

ENV INTERNAL_HOST_IP 172.17.0.1
#RUN export INTERNAL_HOST_IP=$(ip route | awk 'NR==1 {print $3}');echo $INTERNAL_HOST_IP;

ENTRYPOINT [ "python" ]
CMD [ "main.py" ]