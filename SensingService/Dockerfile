FROM python:3-alpine
#FROM tiangolo/uwsgi-nginx-flask:python3.6-alpine3.7

COPY . /app

WORKDIR /app

# Required library for cryptography
#RUN apk add --no-cache libressl-dev musl-dev libffi-dev

# Required library for psycopg2
RUN apk update && apk add postgresql-dev gcc python3-dev musl-dev

RUN apk add --no-cache python3-dev libstdc++ && \
    apk add --no-cache g++ && \
    ln -s /usr/include/locale.h /usr/include/xlocale.h

RUN apk add --update \
  && apk add iproute2 \
  && pip install --upgrade pip  \
  && pip install --upgrade cython \
  && pip install --upgrade numpy

RUN echo "http://mirror.leaseweb.com/alpine/edge/testing" >> /etc/apk/repositories
RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories
RUN apk add --virtual .build-deps \
        --repository http://dl-cdn.alpinelinux.org/alpine/edge/testing \
        --repository http://dl-cdn.alpinelinux.org/alpine/edge/main \
        gcc libc-dev geos-dev geos && \
    runDeps="$(scanelf --needed --nobanner --recursive /usr/local \
    | awk '{ gsub(/,/, "\nso:", $2); print "so:" $2 }' \
    | xargs -r apk info --installed \
    | sort -u)" && \
    apk add --virtual .rundeps $runDeps
RUN ["pip", "install", "shapely"]

RUN pip install -r requirements.txt \
  && rm -rf /var/cache/apk/*

ENV POSTGRES_PW supersecretpassword
ENV POSTGRES_PORT 5433

ENV INTERNAL_HOST_IP 172.17.0.1
#RUN export INTERNAL_HOST_IP=$(ip route | awk 'NR==1 {print $3}');echo $INTERNAL_HOST_IP;

ENTRYPOINT [ "python" ]
CMD [ "main.py" ]