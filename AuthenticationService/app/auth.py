from app import app
import jwt


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
