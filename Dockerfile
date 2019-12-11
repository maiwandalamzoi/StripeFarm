FROM postgres:11

ENV POSTGISV 2.5
ENV TZ Europe/Amsterdam

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  postgresql-$PG_MAJOR-postgis-$POSTGISV \
  postgresql-$PG_MAJOR-postgis-$POSTGISV-scripts \
  postgresql-server-dev-$PG_MAJOR \
  unzip \
  make \
  && apt-get purge -y --auto-remove postgresql-server-dev-$PG_MAJOR make unzip

# set time zone
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# add init script
RUN mkdir -p /docker-entrypoint-initdb.d
COPY ./initdb-postgis.sh /docker-entrypoint-initdb.d/postgis.sh
RUN chmod +x ./docker-entrypoint-initdb.d/postgis.sh

#EXPOSE 5433
EXPOSE 5432

# create volume for backups
#VOLUME ["/opt/backups"]