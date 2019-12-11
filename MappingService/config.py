import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'very-secret-key'

    POSTGRES_URL = "127.0.0.1:5432"
    POSTGRES_USER = "postgres"
    POSTGRES_PW = "admin"
    POSTGRES_DB = "testmicroblog"

    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(
            user=POSTGRES_USER,
            pw=POSTGRES_PW,
            url=POSTGRES_URL,
            db=POSTGRES_DB)

    # silence the warning that signals the application
    # every time a change is about to be made in the database
    SQLALCHEMY_TRACK_MODIFICATIONS = False
