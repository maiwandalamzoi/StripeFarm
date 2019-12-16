FROM rbolkhovitin/psycopg2-geo-scipy

COPY . /app
WORKDIR /app

RUN apk add --update \
  && pip install --upgrade pip \
  && pip install -r requirements.txt \
  && rm -rf /var/cache/apk/*

ENV POSTGRES_PW supersecretpassword

ENTRYPOINT [ "python" ]
CMD [ "main.py" ]
