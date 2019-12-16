""" Controller and routes for user authentication """
from app import app, db, bcrypt
from flask import request, jsonify, json
from flask_jwt_extended import (create_access_token,
                                create_refresh_token,
                                decode_token,
                                jwt_refresh_token_required,
                                jwt_required, get_jwt_identity)
from sqlalchemy import exc
import datetime
from .user import validate_user
from .models import *
from .auth import *
from .utils import *
import sys

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response


def verify_request(identity, resource, method, **kwargs):
    payload = {
        "method": method,
        "resource": {
            "name": resource,
            "meta": None
        }
    }

    res_meta = {}

    for key, value in kwargs.items():
        if value:
            res_meta[key] = value

    if res_meta:
        payload["resource"]["meta"] = res_meta

    response = get_user_access(identity, payload["resource"], method)
    return response


@app.route('/api/users', methods=['GET'])
@jwt_required
def get_users():
    """
    Get all users (Only for admin)
    :return: A list of users
    """
    current_user = get_jwt_identity()
    if current_user['is_admin'] is False:
        return jsonify({'message': 'User does not have permission'}), 403

    try:
        users = []

        for us in User.query.all():
            users.append(us.to_json())

        if not users:
            return jsonify({'message': 'No user found'}), 404
        else:
            json_str = json.dumps(users)
            response = jsonify(json_str)
    except exc.SQLAlchemyError:
        return jsonify({'message': 'No user found'}), 404

    return response


@app.route('/api/users/register', methods=['POST'])
def register_user():
    """
    Create new user / User registration
    :return: JWT access token
    """
    data = request.json

    first_name = data.get('first_name', None)
    last_name = data.get('last_name', None)
    email = data.get('email', None)
    password = data.get('password', None)

    if email is None or \
            password is None:
        return jsonify({'message': 'Missing required data'}), 400

    # Check if user data is unique
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already exists in database'}), 400

    password = bcrypt.generate_password_hash(password)

    try:
        user = User(email, password)
        user.first_name = first_name
        user.last_name = last_name

        db.session.add(user)
        db.session.commit()
    except exc.SQLAlchemyError as e:
        return jsonify({'message': 'Failed to store user with error:\n{}'.format(e)}), 400

    identity = create_token_user_id(user.id)

    token = create_access_token(identity=identity)
    refresh_token = create_refresh_token(identity=identity)

    return jsonify({'message': 'Created',
                    'user_id': user.id,
                    'access_token': token,
                    'refresh_token': refresh_token}), 201


@app.route('/api/users/<user_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required
def user_by_id(user_id):
    current_user = get_jwt_identity()

    if current_user['is_admin'] is False and \
            str(current_user['user_id']) != str(user_id):
        return jsonify({'message': 'User does not have permission'}), 403

    response = ""
    user = User.query.get(user_id)

    if user is None:
        return jsonify({'message': 'The selected user does not exist'}), 404

    if request.method == 'GET':
        response = jsonify(user.to_json()), 200

    elif request.method == 'PUT':
        data = request.json

        if data is None:
            return jsonify({'message': 'No input data'}), 400

        first_name = data.get('first_name', None)
        last_name = data.get('last_name', None)
        email = data.get('email', None)
        password = data.get('password', None)

        if email is None or \
                password is None:
            return jsonify({'message': 'Missing required data'}), 400

        if email != user.email:
            if User.query.filter_by(email=email).first():
                return jsonify({'message': 'Another user already uses email {}'.format(email)}), 400

        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.password = bcrypt.generate_password_hash(password)

        try:
            db.session.commit()
        except exc.SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({'message': 'Failed to update user with error:\n{}'.format(e)}), 400

        response = jsonify({'message': 'Updated', 'user_id': user_id}), 201

    elif request.method == 'DELETE':
        db.session.query(User).filter(User.id == user_id).delete()
        db.session.commit()
        response = jsonify({'message': 'The user was deleted successfully'}), 204

    return response


@app.route('/api/roles', methods=['GET', 'POST'])
@jwt_required
def get_roles():
    response = ""

    if request.method == 'GET':
        roles = []

        for rl in Role.query.all():
            roles.append(rl.to_json())

        if not roles:
            return jsonify({'message': 'No role found'}), 404
        else:
            json_str = json.dumps(roles)
            response = jsonify(json_str)

    elif request.method == 'POST':
        # Only for system admin
        current_user = get_jwt_identity()

        if current_user['is_admin'] is False:
            return jsonify({'message': 'User does not have permission'}), 403

        data = request.json

        if data is None:
            return jsonify({'message': 'No input data'}), 400

        role_name = data.get('role', None)

        if role_name is None:
            return jsonify({'message': 'Missing required data'}), 400

        try:
            role, is_created = get_or_create(db.session, Role,
                                             name=role_name)

            if is_created:
                db.session.commit()
                response = jsonify({'message': 'Created', 'role_id': role.id}), 200
            else:
                response = jsonify({'message': 'Role {} already exists'.format(role_name)}), 200

        except exc.SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({'message': 'Failed to store role {} with error:\n{}'.format(role_name, e)}), 400

    return response


@app.route('/api/roles/<role_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required
def get_role_by_id(role_id):
    response = ""

    # Only for system admin
    current_user = get_jwt_identity()

    if current_user['is_admin'] is False:
        return jsonify({'message': 'User does not have permission'}), 403

    role = Role.query.get(role_id)

    if role is None:
        return jsonify({'message': 'The selected role does not exist'}), 404

    if request.method == 'GET':
        response = jsonify(role.to_json()), 200

    elif request.method == 'PUT':
        role_name = request.json.get('name', None)

        if role_name != role.name:
            if Role.query.filter_by(name=role_name).first():
                return jsonify({'message': 'Role {} already exists'.format(role_name)}), 400

            try:
                role.name = role_name
                db.session.commit()
                response = jsonify({'message': 'Updated', 'role': role_name}), 201
            except exc.SQLAlchemyError as e:
                db.session.rollback()
                return jsonify({'message': 'Failed to store role {} with error:\n{}'.format(role_name, e)}), 400

    elif request.method == 'DELETE':
        db.session.query(Role).filter(Role.id == role_id).delete()
        db.session.commit()
        response = jsonify({'message': 'The role was deleted successfully'}), 204

    return response


@app.route('/api/roles/permissions', methods=['GET', 'POST'])
@jwt_required
def get_role_permissions():
    response = ""

    if request.method == 'GET':
        role_list = []
        cur_role = None

        for rl, pr, rs in db.session.query(Role, RolePermission, Resource) \
                .filter(Role.id == RolePermission.role_id) \
                .filter(RolePermission.resource_id == Resource.id) \
                .order_by(Role.id) \
                .order_by(Resource.id).all():
            if cur_role is None or cur_role['role'] != rl.name:
                permission = {
                    'resource': rs.name,
                    'methods': [pr.permission_type.value]
                }

                role = {
                    'id': rl.id,
                    'role': rl.name,
                    'permissions': [permission]
                }

                cur_role = role
                role_list.append(cur_role)
            else:
                permission_list = cur_role.get('permissions')
                cur_permission = permission_list[-1]

                if cur_permission.get('resource') == rs.name:
                    cur_permission['methods'].append(pr.permission_type.value)
                else:
                    permission = {
                        'resource': rs.name,
                        'methods': [pr.permission_type.value]
                    }

                    permission_list.append(permission)

        if not role_list:
            return jsonify({'message': 'No role permission found'}), 404
        else:
            json_str = json.dumps(role_list)
            response = jsonify(json_str)

    elif request.method == 'POST':
        # Only for system admin
        current_user = get_jwt_identity()

        if current_user['is_admin'] is False:
            return jsonify({'message': 'User does not have permission'}), 403

        data = request.json

        if data is None:
            return jsonify({'message': 'Missing required data'}), 400

        role_name = data.get("role", None)
        permissions = data.get("permissions", None)

        if role_name is None or permissions is None:
            return jsonify({'message': 'Missing required data in role name'}), 400

        role_query, is_created = get_or_create(db.session, Role,
                                               name=role_name)

        if is_created:
            db.session.commit()
        else:
            return jsonify({'message': 'Role {} already exists. Use PUT method to update.'.format(role_name)}), 400

        response = create_role_permissions(db.session, permissions, role_query.id, role_name)

    return response


@app.route('/api/roles/permissions/<role_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required
def get_role_permission_by_id(role_id):
    response = ""

    # PUT and DELETE only for system admin or internal calls
    current_user = get_jwt_identity()

    role_query = Role.query.get(role_id)
    if role_query is None:
        return jsonify({'message': 'The selected role does not exist'}), 404

    if request.method == 'GET':
        cur_role = None

        for pr, rs in db.session.query(RolePermission, Resource) \
                .filter(RolePermission.role_id == role_id, RolePermission.resource_id == Resource.id) \
                .order_by(Resource.id).all():
            if cur_role is None:
                permission = {
                    'resource': rs.name,
                    'methods': [pr.permission_type.value]
                }

                role = {
                    'id': role_id,
                    'role': role_query.name,
                    'permissions': [permission]
                }

                cur_role = role
            else:
                permission_list = cur_role.get('permissions')
                cur_permission = permission_list[-1]

                if cur_permission.get('resource') == rs.name:
                    cur_permission['methods'].append(pr.permission_type.value)
                else:
                    permission = {
                        'resource': rs.name,
                        'methods': [pr.permission_type.value]
                    }

                    permission_list.append(permission)

        if not cur_role:
            return jsonify({'message': 'No role permission found'}), 404
        else:
            response = jsonify(cur_role)

    elif request.method == 'PUT':
        if current_user['is_admin'] is False:
            return jsonify({'message': 'User does not have permission'}), 403

        data = request.json

        if data is None:
            return jsonify({'message': 'No input data'}), 400

        role_name = data.get('role', None)
        permissions = data.get('permissions', [])

        if role_name is None or permissions is []:
            return jsonify({'message': 'Missing required data'}), 400

        role = Role.query.filter_by(name=role_name).first()

        if role is None:
            return jsonify({'message': 'No role name found'}), 404

        db.session.query(RolePermission).filter(RolePermission.role_id == role_id).delete()
        db.session.commit()

        response, res_code = create_role_permissions(db.session, permissions, role_query.id, role_name)

        if res_code == 200:
            response = jsonify({'message': 'Updated', 'role': role_name}), 201

    elif request.method == 'DELETE':
        if current_user['is_admin'] is False:
            return jsonify({'message': 'User does not have permission'}), 403

        db.session.query(RolePermission).filter(RolePermission.role_id == role_id).delete()
        db.session.commit()
        response = jsonify({'message': 'The role permission was deleted successfully'}), 204

    return response


@app.route('/api/farm_users/<farm_id>', methods=['GET', 'POST', 'DELETE'])
@jwt_required
def farm_users(farm_id):
    current_user = get_jwt_identity()

    access_res = verify_request(current_user, "farm_user", request.method, farm_id=farm_id)

    if not access_res["valid"]:
        return jsonify({'message': 'User does not have permission'}), 403

    response = ""

    if request.method == 'GET':
        fu_list = []

        try:
            for fu, user, rl in db.session.query(FarmUser, User, Role) \
                    .filter(FarmUser.farm_id == farm_id) \
                    .filter(FarmUser.user_id == User.id, FarmUser.role_id == Role.id).all():
                # rl = Role.query.filter_by(id=fu.role_id).first()
                fu_json = {
                    'user_id': fu.user_id,
                    'email': user.email,
                    'role': rl.to_json()
                }

                fu_list.append(fu_json)

        except exc.SQLAlchemyError:
            return jsonify({'message': 'No farm user found'}), 404

        if not fu_list:
            return jsonify({'message': 'No farm user found'}), 404

        json_str = json.dumps(fu_list)
        response = jsonify(json_str), 200

    elif request.method == 'POST':
        data = request.json

        # get use_email param
        using_email = bool(request.args.get('use_email'))

        cur_user_id = current_user['user_id']
        is_admin = current_user['is_admin']
        user_id = data.get('user_id')
        user_email = data.get('email')
        role_name = data.get('role')

        if (using_email and not user_email) or \
                (not using_email and not user_id) or \
                (role_name is None):
            return jsonify({'message': 'Missing required data'}), 400

        if using_email:
            user = User.query.filter_by(email=user_email).first()
            if user:
                user_id = user.id
        else:
            user = User.query.get(user_id)

        if user is None:
            return jsonify({'message': 'User is not found'}), 400

        role = Role.query.filter_by(name=role_name).first()
        if role is None:
            return jsonify({'message': 'Role {} is not found'.format(role_name)}), 400

        if (not FarmUser.query.filter_by(farm_id=farm_id).first() and
                role_name != RoleType.FARM_ADMIN.value):
            return jsonify({'message': 'First farm user should be a farm admin'}), 400

        if cur_user_id != user_id:
            # Current user ID has to be a farm admin or system admin
            cur_fu = FarmUser.query.filter_by(user_id=cur_user_id, farm_id=farm_id).first()

            if not cur_fu:
                return jsonify({'message': 'Farm needs a farm admin'}), 400

            cur_role = Role.query.filter_by(id=cur_fu.role_id).first()
            cur_role_name = cur_role.name

            if not (cur_role_name == RoleType.FARM_ADMIN.value or
                    is_admin):
                return jsonify({'message': 'User does not have permission'}), 403

        try:
            fu, is_created = get_or_create(db.session, FarmUser,
                                           farm_id=farm_id,
                                           user_id=user_id,
                                           role_id=role.id)

            if is_created:
                db.session.commit()
                response = jsonify({'message': 'Created'}), 201
            else:
                response = jsonify({'message': 'Farm user {} already exists'.format(user_id)}), 201

        except exc.SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({'message': 'Failed to store farm user {} with error:\n{}'.format(user_id, e)}), 400

    elif request.method == 'DELETE':
        cur_user_id = current_user['user_id']
        is_admin = current_user['is_admin']

        if not is_admin:
            cur_fu = FarmUser.query.filter_by(user_id=cur_user_id, farm_id=farm_id).first()

            if not cur_fu:
                return jsonify({'message': 'User does not have permission'}), 403

            cur_role = Role.query.filter_by(id=cur_fu.role_id).first()
            cur_role_name = cur_role.name

            if not cur_role_name == RoleType.FARM_ADMIN.value:
                return jsonify({'message': 'User does not have permission'}), 403

        db.session.query(FarmUser).filter(FarmUser.farm_id == farm_id).delete()
        db.session.commit()
        response = jsonify({'message': 'The users for farm id {} were deleted successfully'.format(farm_id)}), 204

    return response


@app.route('/api/farm_users/<farm_id>/users/<user_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required
def farm_user_by_id(farm_id, user_id):
    # Only for system admin, farm admin, or user with same id with user_id
    current_user = get_jwt_identity()

    # allow a user to check his/her own permission in a farm
    if not (str(current_user['user_id']) == str(user_id) and
            request.method == 'GET'):
        access_res = verify_request(current_user, "farm_user", request.method, farm_id=farm_id)

        if not access_res["valid"]:
            return jsonify({'message': 'User does not have permission'}), 403

    fu = FarmUser.query.filter_by(farm_id=farm_id, user_id=user_id).first()

    if fu is None:
        return jsonify({'message': 'The selected farm user does not exist'}), 404

    response = ""

    if request.method == 'GET':
        role = Role.query.filter_by(id=fu.role_id).first()
        response = jsonify(fu.to_json(role)), 200

    elif request.method == 'PUT':
        data = request.json

        user_id = data.get('user_id')
        role_name = data.get('role')

        if user_id is None or role_name is None:
            return jsonify({'message': 'Missing required data'}), 400

        if User.query.get(user_id) is None:
            return jsonify({'message': 'User ID {} is not found'.format(user_id)}), 400

        role = Role.query.filter_by(name=role_name).first()
        if role is None:
            return jsonify({'message': 'Role {} is not found'.format(role_name)}), 400

        fu.role_id = role.id

        try:
            db.session.commit()
        except exc.SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({'message': 'Failed to store farm user {} with error:\n{}'.format(user_id, e)}), 400

        response = jsonify({'message': 'Updated'}), 201

    elif request.method == 'DELETE':
        db.session.query(FarmUser).filter(FarmUser.id == fu.id).delete()
        db.session.commit()
        response = jsonify({'message': 'The farm user was deleted successfully'}), 204

    return response


@app.route('/api/farm_users/user_roles/<user_id>', methods=['GET'])
@jwt_refresh_token_required
def user_roles_in_farms(user_id):
    current_user = get_jwt_identity()

    access_res = verify_request(current_user, "farm_user", request.method)

    if not access_res["is_admin"]:
        return jsonify({'message': 'User does not have permission'}), 403

    role_list = []

    try:
        for fu, rl in db.session.query(FarmUser, Role) \
                .filter(FarmUser.user_id == int(user_id)) \
                .filter(FarmUser.role_id == Role.id).all():
            user_role = {
                'farm_id': fu.id,
                'role': rl.name
            }
            role_list.append(user_role)

        if not role_list:
            return jsonify({'message': 'No role for user ID {} found'.format(user_id)}), 404
        else:
            json_str = json.dumps(role_list)
            response = jsonify(json_str)
    except exc.SQLAlchemyError as e:
        return jsonify({'message': 'Failed to get user role with error:\n{}'.format(e)}), 400

    return response


@app.route('/api/auth/refresh_token', methods=['GET'])
@jwt_refresh_token_required
def refresh_access_token():
    current_user = get_jwt_identity()

    ret = {
        'access_token': create_access_token(identity=current_user)
    }
    return jsonify(ret), 200


@app.route('/api/auth/jwt_token', methods=['POST'])
def get_token():
    data = validate_user(request.get_json())

    if data['ok']:
        data = data['data']
        user = User.query.filter_by(email=data['email']).first()

        if user and bcrypt.check_password_hash(user.password, data['password']):

            identity = create_token_user_id(user.id)

            # Get role
            role_set = set()
            for fu, rl in db.session.query(FarmUser, Role) \
                    .filter(FarmUser.user_id == user.id) \
                    .filter(FarmUser.role_id == Role.id).all():
                role_set.add(rl.name)

            if RoleType.SYSADMIN.value in role_set:
                identity['is_admin'] = True
            else:
                identity['is_admin'] = False

            access_token = create_access_token(identity=identity)
            refresh_token = create_refresh_token(identity=identity)

            return jsonify({'access_token': access_token,
                            'refresh_token': refresh_token,
                            'user_id': user.id}), 200

        else:
            return jsonify({'ok': False, 'message': 'invalid username or password'}), 401

    else:
        return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400


@app.route('/api/auth/access_verification', methods=['POST'])
@jwt_required
def access_verification():
    current_user = get_jwt_identity()

    data = request.json
    method = data.get("method", None)
    resource = data.get("resource", None)

    if not resource or not method:
        return jsonify({"message": "Missing required data"}), 400

    response = get_user_access(current_user, resource, method)
    return jsonify(response), 200
