from app import app
import base64
import hmac
import json
import jwt


# def encode_auth_token(user_id):
#     """
#     Generates the Auth token
#     :param user_id: User ID
#     :return: string
#     """
#     data = {
#         'sub': user_id,
#         'iat': datetime.datetime.utcnow(),
#         'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, minutes=20),
#     }
#     # access_token = create_access_token(identity=data)
#     secret = app.config.get("JWT_SECRET_KEY")
#     print("JWT Secret: {}".format(secret))
#     access_token = jwt.encode(data, secret, algorithm='HS256')
#
#     return access_token


def decode_auth_token(auth_token):
    """
    Decodes the auth token
    :param auth_token:
    :return: integer|string
    """
    try:
        payload = jwt.decode(auth_token, app.config.get('JWT_SECRET_KEY'))
        return payload, True

        # key = app.config.get('JWT_SECRET_KEY')
        # verified, payload = verify_signed_token(key, auth_token)
        # return payload, verified
    except jwt.ExpiredSignatureError:
        return 'Signature expired. Please log in again.', False
    except jwt.InvalidTokenError:
        return 'Invalid token. Please log in again.', False


def create_token_user_id(user_id, is_admin=False):
    identity = {
        'user_id': user_id,
        'is_admin': is_admin,
    }

    return identity


def get_token_from_header(header):
    prefix = 'Bearer '

    if not header.startswith(prefix):
        raise ValueError('Invalid token')
    return header[len(prefix):]
