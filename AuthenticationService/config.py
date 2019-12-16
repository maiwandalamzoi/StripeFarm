import os
from datetime import timedelta

basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'very-secret-key'

    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'very-secret-jwt-key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=10)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)
    # JWT_MAX_COUNTER = os.environ.get('JWT_MAX_COUNTER') or 100

    # POSTGRES_URL = "{}:{}".format(os.environ.get('INTERNAL_HOST_IP'),
    #                               os.environ.get('POSTGRES_PORT'))
    POSTGRES_URL = "db"
    POSTGRES_USER = "postgres"
    POSTGRES_PW = os.environ.get('POSTGRES_PW')
    POSTGRES_DB = "user_db"

    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
                              'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(user=POSTGRES_USER,
                                                                                    pw=POSTGRES_PW,
                                                                                    url=POSTGRES_URL,
                                                                                    db=POSTGRES_DB)

    # silence the warning that signals the application every time a change is about to be made in the database
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_RECORD_QUERIES = False
    # DEBUG = False
