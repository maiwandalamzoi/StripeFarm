import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'very-secret-key'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'very-secret-jwt-key'

    # POSTGRES_URL = "{}:{}".format(os.environ.get('INTERNAL_HOST_IP'),
    #                               os.environ.get('POSTGRES_PORT'))
    POSTGRES_URL = "db"
    POSTGRES_USER = "postgres"
    POSTGRES_PW = os.environ.get('POSTGRES_PW')
    POSTGRES_DB = "farm_db"

    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
                              'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(user=POSTGRES_USER,
                                                                                    pw=POSTGRES_PW,
                                                                                    url=POSTGRES_URL,
                                                                                    db=POSTGRES_DB)

    # silence the warning that signals the application every time a change is about to be made in the database
    SQLALCHEMY_TRACK_MODIFICATIONS = False
