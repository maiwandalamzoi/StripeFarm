from flask import request, jsonify, json, g
from app import app, db
from sqlalchemy import exc
from .models import *
from .utils import *
from .api.MappingApi import MappingApi
from .api.AuthApi import AuthApi
from cryptography.fernet import Fernet


api_route_str = '/api'


@app.before_request
def before_request_func():
    headers = {
        'Authorization': request.headers.get('Authorization'),
        'content-type': "application/json",
    }

    g.auth_header = headers
    g.method = request.method


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response


def encrypt_token(msg):
    message = msg.encode()
    key = app.config.get('SECRET_KEY')

    return Fernet(key).encrypt(message)


def decrypt_token(token):
    token = token.encode()
    key = app.config.get('SECRET_KEY')

    return Fernet(key).decrypt(token)


# def verify_request(resource, allow_internal=False, **kwargs):
#     header_type = None
#     auth_header = g.auth_header.get('Authorization')
#
#     ret_code = 403
#     message = "Authorization headers cannot be processed"
#
#     # header_type for Inter-service communication
#     if auth_header.startswith('Internal '):
#         if allow_internal:
#             token = auth_header[len('Internal '):]
#
#             # Decode token to get identity
#             identity = decrypt_token(token)
#             user_id = identity.get("user_id")
#             is_admin = identity.get("is_admin", False)
#
#             message = {
#                 'valid': True,
#                 'is_admin': is_admin,
#                 'user_id': user_id
#             }
#
#             ret_code = 200
#
#     # header_type with JWT token
#     elif auth_header.startswith('Bearer '):
#         payload = {
#             "method": g.method,
#             "resource": {
#                 "name": resource,
#                 "meta": None
#             }
#         }
#
#         res_meta = {}
#
#         for key, value in kwargs.items():
#             if value:
#                 res_meta[key] = value
#
#         if res_meta:
#             payload["resource"]["meta"] = res_meta
#
#         message, ret_code = AuthApi.verify_request(payload, g.auth_header)
#
#         # Changing dict key from python library
#         if message.get("msg"):
#             message["message"] = message.pop("msg")
#
#     return ret_code, message
def verify_request(resource, allow_internal=False, **kwargs):
    payload = {
        "method": g.method,
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

    message, ret_code = AuthApi.verify_request(payload, g.auth_header)

    # Changing dict key from python library
    if message.get("msg"):
        message["message"] = message.pop("msg")

    return ret_code, message


def filter_dict_status_list(status, dict_list):
    res = None

    if dict_list and dict_list.get("allowed_access", None):
        ret_list = list(filter(lambda res: res['status'] == status, dict_list["allowed_access"]))
        if ret_list:
            res = ret_list[0]

    return res


def get_accessible_farm_list(dict_list):
    private_res = filter_dict_status_list("private", dict_list)

    if private_res and private_res.get("status", None) is not None:
        farm_list = private_res.get("farm_id")

        return farm_list

    return None


@app.route(api_route_str + '/farms/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'ping'}), 200


@app.route(api_route_str + '/farms', methods=['GET', 'POST'])
def get_farms():
    ret_code, msg = verify_request("farm")
    is_valid = msg.get("valid", False)

    if ret_code != 200:
        return msg, ret_code

    if not is_valid:
        return jsonify({'message': 'User does not have permission'}), 403

    if request.method == 'GET':
        # Get all farms
        try:
            farms = []

            is_admin = msg.get("is_admin")
            if is_admin:
                for fm, ac in db.session.query(Farm, AccessibilityStatus) \
                        .filter(Farm.access_id == AccessibilityStatus.id).all():
                    ct = None
                    if fm.country_id:
                        ct = Country.query.get(fm.country_id)

                    farms.append(fm.to_json(ct, ac))

            else:
                # Get private access
                flist = get_accessible_farm_list(msg)
                if flist:
                    try:
                        for fm, ac in db.session.query(Farm, AccessibilityStatus) \
                                .filter(Farm.access_id == AccessibilityStatus.id) \
                                .filter(Farm.id.in_(flist)) \
                                .filter(AccessibilityStatus.name == "private").all():
                            ct = None
                            if fm.country_id:
                                ct = Country.query.get(fm.country_id)

                            farms.append(fm.to_json(ct, ac))
                    except TypeError:
                        fm = ac = None

                try:
                    for fm, ac in db.session.query(Farm, AccessibilityStatus) \
                            .filter(Farm.access_id == AccessibilityStatus.id) \
                            .filter(AccessibilityStatus.name == "public").all():
                        ct = None
                        if fm.country_id:
                            ct = Country.query.get(fm.country_id)
                        farms.append(fm.to_json(ct, ac))
                except TypeError:
                    fm = ac = None

            if not farms:
                return jsonify({'message': 'No farm found'}), 404
            else:
                json_str = json.dumps(farms)
                response = jsonify(json_str)
        except exc.SQLAlchemyError as e:
            return jsonify({'message': 'Failed to get farm with error:\n{}'.format(e)}), 400

    elif request.method == "POST":
        data = request.get_json()
        response = create_farm(data)

        if response[-1] == 201:
            farm_name = get_dict_value(data, 'name')
            user_id = msg.get("user_id")
            farm_query = Farm.query.filter_by(name=farm_name).first()

            if farm_query:
                farm_id = farm_query.id
                AuthApi.add_farm_user("farm_admin", user_id, farm_id, g.auth_header)
    else:
        return jsonify({'message': 'Method is not supported'}), 404

    return response


@app.route(api_route_str + '/farms/<farm_id>', methods=['GET', 'PUT', 'DELETE'])
def farm_by_id(farm_id):
    ret_code, msg = verify_request("farm", farm_id=farm_id)
    is_valid = msg.get("valid", False)

    if ret_code != 200:
        return msg, ret_code

    if not is_valid:
        return jsonify({'message': 'User does not have permission'}), 403

    if request.method == 'GET':
        status_list = []
        if msg.get("is_admin", False):
            status_list = ["public", "private"]
        else:
            allowed_access = msg.get("allowed_access")
            if allowed_access:
                for access in allowed_access:
                    status = access.get("status")
                    if status:
                        if status == "private":
                            flist = get_accessible_farm_list(msg)
                            if flist and farm_id in flist:
                                status_list.append(status)
                        else:
                            status_list.append(status)

        if not len(status_list):
            return jsonify({'message': 'User does not have permission'}), 403

        # Check access status
        try:
            farm, ac = db.session.query(Farm, AccessibilityStatus) \
                .filter(Farm.access_id == AccessibilityStatus.id) \
                .filter(Farm.id == farm_id) \
                .filter(AccessibilityStatus.name.in_(status_list)).first()
        except TypeError:
            farm = ac = None

        if farm is None:
            return jsonify({'message': 'The selected farm does not exist'}), 404
        else:
            country_query = None
            if farm.country_id:
                country_query = Country.query.get(farm.country_id)

            json_str = json.dumps(farm.to_json(country_query, ac))
            response = jsonify(json_str), 200
            # response = jsonify(farm.to_json(country_query, ac)), 200

    elif request.method == "PUT":
        data = request.json

        if data is None:
            return jsonify({'message': 'No input data'}), 400

        farm = Farm.query.get(farm_id)

        if farm is None:
            response = create_farm(data)
        else:
            try:
                if farm.name != data['name']:
                    # Check if farm exists in database
                    if Farm.query.filter_by(name=data['name']).first() is not None:
                        return jsonify({'message': 'Farm name already exists in database'}), 400
                    else:
                        farm.name = data['name']
            except KeyError:
                return jsonify({'message': 'Missing required data'}), 400

            if 'country_id' in data:
                if farm.country_id != data['country_id']:
                    # Check if country exists in database
                    if data['country_id'] is None:
                        farm.country_id = None
                    else:
                        if Country.query.get(data['country_id']):
                            farm.country_id = data['country_id']
                            any_changes = True
                        else:
                            return jsonify({'message': 'Country ID of the farm does not exist'}), 400

            if 'address' in data:
                farm.address = data['address']

            if 'postal_code' in data:
                farm.postal_code = data['postal_code']

            if 'email' in data:
                farm.email = data['email']

            if 'phone' in data:
                farm.phone_number = data['phone']

            if 'webpage' in data:
                farm.website = data['webpage']

            access = get_dict_value(data, 'accessibility')
            if access:
                ac = AccessibilityStatus.query.filter_by(name=access).first()
                if ac:
                    farm.access_id = ac.id
                else:
                    return jsonify({'message': 'Accessibility status does not exist in database'}), 400

            db.session.commit()
            response = jsonify({'message': 'Updated', 'farm': farm.name, 'farm_id': farm_id}), 201

    elif request.method == "DELETE":
        farm = Farm.query.get(farm_id)

        if farm is None:
            return jsonify({'message': 'Farm not found'}), 404
        else:
            db.session.query(Farm).filter(Farm.id == farm_id).delete()
            db.session.commit()
            response = jsonify({'message': 'The farm was deleted successfully'}), 204

            # Delete all farm users
            AuthApi.delete_farm_users(farm_id, g.auth_header)

    else:
        return jsonify({'message': 'Method is not supported'}), 404

    return response


@app.route(api_route_str + '/farms/<farm_id>/fields', methods=['GET', 'POST'])
def get_farm_fields(farm_id):
    ret_code, msg = verify_request("field", farm_id=farm_id)
    is_valid = msg.get("valid", False)

    if ret_code != 200:
        return msg, ret_code

    if not is_valid:
        return jsonify({'message': 'User does not have permission'}), 403

    response = ""

    if request.method == 'GET':
        try:
            field_list = []
            status_list = []

            if msg.get("is_admin", False):
                status_list = ["public", "private"]

            else:
                allowed_access = msg.get("allowed_access")
                if allowed_access:
                    for access in allowed_access:
                        status = access.get("status")
                        if status:
                            if status == "private":
                                flist = get_accessible_farm_list(msg)
                                if flist and farm_id in flist:
                                    status_list.append(status)
                            else:
                                status_list.append(status)

            if not len(status_list):
                return jsonify({'message': 'No farm field found'}), 404

            for fd, ac in db.session.query(Field, AccessibilityStatus) \
                    .filter(Field.access_id == AccessibilityStatus.id) \
                    .filter(Field.farm_id == farm_id) \
                    .filter(AccessibilityStatus.name.in_(status_list)).all():
                st = None
                if fd.soil_type_id:
                    st = SoilType.query.get(fd.soil_type_id)
                field_json = fd.to_json(st, ac)
                if 'coordinates' in field_json:
                    area = convert_polygon_wkb(field_json['coordinates'])
                    field_json['coordinates'] = area
                field_list.append(field_json)

            if not field_list:
                return jsonify({'message': 'No farm field found'}), 404
            else:
                json_str = json.dumps(field_list)
                response = jsonify(json_str), 200
        except exc.SQLAlchemyError as e:
            return jsonify({'message': 'Failed to get farm field with error:\n{}'.format(e)}), 400

    elif request.method == 'POST':
        data = request.json

        if data is None:
            return jsonify({'message': 'Missing required data'}), 400

        response = create_field(farm_id, data)

    return response


@app.route(api_route_str + '/farms/<farm_id>/fields/<field_id>', methods=['GET', 'PUT', 'DELETE'])
def get_farm_field_by_id(farm_id, field_id):
    ret_code, msg = verify_request("field",
                                   farm_id=farm_id,
                                   field_id=field_id)
    is_valid = msg.get("valid", False)

    if ret_code != 200:
        return msg, ret_code

    if not is_valid:
        return jsonify({'message': 'User does not have permission'}), 403

    response = ""

    if request.method == 'GET':
        status_list = []

        is_admin = msg.get("is_admin", False)
        if is_admin:
            status_list = ["public", "private"]
        else:
            allowed_access = msg.get("allowed_access")
            if allowed_access:
                for access in allowed_access:
                    status = access.get("status")
                    if status == "private":
                        flist = get_accessible_farm_list(msg)
                        if flist and farm_id in flist:
                            status_list.append(status)
                    else:
                        status_list.append(status)

        if not len(status_list):
            return jsonify({'message': 'No farm field found'}), 404

        try:
            fd, ac = db.session.query(Field, AccessibilityStatus) \
                .filter(Field.access_id == AccessibilityStatus.id) \
                .filter(Field.farm_id == farm_id, Field.id == field_id) \
                .filter(AccessibilityStatus.name.in_(status_list)).first()
        except TypeError:
            fd = ac = None

        if fd is None:
            return jsonify({'message': 'No farm field found'}), 404

        st = None
        if fd.soil_type_id:
            st = SoilType.query.get(fd.soil_type_id)

        field_json = fd.to_json(st, ac)

        if 'coordinates' in field_json:
            area = convert_polygon_wkb(field_json['coordinates'])
            field_json['coordinates'] = area

        json_str = json.dumps(field_json)
        response = jsonify(json_str), 200
        # response = jsonify(field_json), 200

    elif request.method == 'PUT':
        data = request.json

        if data is None:
            return jsonify({'message': 'No input data'}), 400

        fd = Field.query.filter_by(farm_id=farm_id, id=field_id).first()

        if fd is None:
            # Create field
            response = create_field(farm_id, data)
        else:
            fd.name = get_dict_value(data, 'field_name')
            fd.size_in_ha = get_dict_value(data, 'size_in_hectare')

            # Check if soil type exists
            soil_id = get_dict_value(data, 'soil_type_id')
            fd.soil_type_id = None

            if soil_id is not None:
                if SoilType.query.get(soil_id):
                    fd.soil_type_id = soil_id

            coordinates = get_dict_value(data, 'coordinates')
            fd.area = to_geo_string(coordinates, geo_type='POLYGON')

            access = get_dict_value(data, 'accessibility')
            if access:
                ac = AccessibilityStatus.query.filter_by(name=access).first()
                if ac:
                    fd.access_id = ac.id
                else:
                    return jsonify({'message': 'Accessibility status does not exist in database'}), 400

            try:
                db.session.commit()
            except exc.SQLAlchemyError as e:
                db.session.rollback()
                return jsonify({'message': 'Failed to update field with error:\n{}'.format(e)}), 400

            response = jsonify({'message': 'Updated', 'field': fd.name}), 201

    elif request.method == 'DELETE':
        fd = Field.query.filter_by(farm_id=farm_id, id=field_id).first()

        if fd is None:
            return jsonify({'message': 'No farm field found'}), 404
        else:
            db.session.query(Field).filter(Field.id == field_id).delete()
            db.session.commit()
            response = jsonify({'message': 'The field was deleted successfully'}), 204

    return response


@app.route(api_route_str + '/farms/<farm_id>/fields/<field_id>/crop_fields', methods=['GET', 'POST'])
def get_crop_fields(farm_id, field_id):
    ret_code, msg = verify_request("crop_field",
                                   farm_id=farm_id,
                                   field_id=field_id)
    is_valid = msg.get("valid", False)

    if ret_code != 200:
        return msg, ret_code

    if not is_valid:
        return jsonify({'message': 'User does not have permission'}), 403

    response = ""

    if request.method == 'GET':
        try:
            cf_list = []
            status_list = []

            is_admin = msg.get("is_admin", False)

            if is_admin:
                status_list = ["public", "private"]

            else:
                allowed_access = msg.get("allowed_access")
                if allowed_access:
                    for access in allowed_access:
                        status = access.get("status")
                        if status:
                            status_list.append(status)

            if not len(status_list):
                return jsonify({'message': 'No crop field found'}), 404

            for cf, ct, ac in db.session.query(CropField, CropType, AccessibilityStatus) \
                    .filter(CropField.access_id == AccessibilityStatus.id,
                            CropField.crop_type_id == CropType.id) \
                    .filter(CropField.farm_id == farm_id,
                            CropField.field_id == field_id) \
                    .filter(AccessibilityStatus.name.in_(status_list)).all():
                cf_json = cf.to_json(ct, ac)
                if 'coordinates' in cf_json:
                    area = convert_polygon_wkb(cf_json['coordinates'])
                    cf_json['coordinates'] = area
                    cf_list.append(cf_json)

            if not cf_list:
                return jsonify({'message': 'No crop field found'}), 404
            else:
                json_str = json.dumps(cf_list)
                response = jsonify(json_str), 200
        except exc.SQLAlchemyError:
            return jsonify({'message': 'No crop field found'}), 404

    elif request.method == 'POST':
        data = request.json

        if data is None:
            return jsonify({'message': 'Missing required data'}), 400

        response = create_crop_field(farm_id, field_id, data)

    return response


@app.route(api_route_str + '/farms/<farm_id>/fields/<field_id>/crop_fields/<crop_field_id>',
           methods=['GET', 'PUT', 'DELETE'])
def get_crop_field_by_id(farm_id, field_id, crop_field_id):
    ret_code, msg = verify_request("crop_field",
                                   farm_id=farm_id,
                                   field_id=field_id,
                                   crop_field_id=crop_field_id)
    is_valid = msg.get("valid", False)

    if ret_code != 200:
        return msg, ret_code

    if not is_valid:
        return jsonify({'message': 'User does not have permission'}), 403

    response = ""

    if request.method == 'GET':
        status_list = []

        is_admin = msg.get("is_admin", False)

        if is_admin:
            status_list = ["public", "private"]
        else:
            allowed_access = msg.get("allowed_access")
            if allowed_access:
                for access in allowed_access:
                    status = access.get("status")
                    if status:
                        status_list.append(status)

        if not len(status_list):
            return jsonify({'message': 'No crop field found'}), 404

        try:
            cf, ct, ac = db.session.query(CropField, CropType, AccessibilityStatus) \
                .filter(CropField.crop_type_id == CropType.id,
                        CropField.access_id == AccessibilityStatus.id) \
                .filter(CropField.farm_id == farm_id,
                        CropField.field_id == field_id,
                        CropField.id == crop_field_id) \
                .filter(AccessibilityStatus.name.in_(status_list)).first()
        except TypeError:
            cf = ct = ac = None

        if cf is None:
            return jsonify({'message': 'No crop field found'}), 404

        field_json = cf.to_json(ct, ac)

        if 'coordinates' in field_json:
            area = convert_polygon_wkb(field_json['coordinates'])
            field_json['coordinates'] = area

        json_str = json.dumps(field_json)
        response = jsonify(json_str), 200

    elif request.method == 'PUT':
        data = request.json

        if data is None:
            return jsonify({'message': 'No input data'}), 400

        cf = CropField.query.filter_by(farm_id=farm_id, field_id=field_id, id=crop_field_id).first()
        if cf is None:
            return jsonify({'message': 'No crop field found'}), 404

        cf.name = get_dict_value(data, 'name')
        cf.farm_id = farm_id
        cf.field_id = field_id
        cf.period_start = get_dict_value(data, 'period_start')
        cf.period_end = get_dict_value(data, 'period_end')

        access = get_dict_value(data, 'accessibility')

        if not access:
            return jsonify({'message': 'Missing required data'}), 400

        ac = AccessibilityStatus.query.filter_by(name=access).first()
        if not ac:
            return jsonify({'message': 'Accessibility status is not found in database'}), 400

        cf.access_id = ac.id

        coordinates = get_dict_value(data, 'coordinates')
        cf.area = to_geo_string(coordinates, geo_type='POLYGON')

        # Check if crop type exists
        crop_id = get_dict_value(data, 'crop_type_id')

        if crop_id is None:
            cf.crop_type_id = None
        else:
            if crop_id != cf.crop_type_id:
                if CropType.query.get(crop_id):
                    cf.crop_type_id = crop_id
                else:
                    return jsonify({'message': 'Crop type ID {} of \
                                    crop field is not found'.format(crop_id)}), 404

        try:
            db.session.commit()
        except exc.SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({'message': 'Failed to update crop field with error:\n{}'.format(e)}), 400

        response = jsonify({'message': 'Updated', 'field': cf.name}), 201

    elif request.method == 'DELETE':
        cf = CropField.query.filter_by(farm_id=farm_id, field_id=field_id, id=crop_field_id).first()
        if cf is None:
            return jsonify({'message': 'No crop field found'}), 404

        db.session.query(CropField).filter(CropField.id == crop_field_id).delete()
        db.session.commit()
        response = jsonify({'message': 'The crop field was deleted successfully'}), 204

    return response


@app.route(api_route_str + '/crop_types', methods=['GET', 'POST'])
def get_crop_types():
    ret_code, msg = verify_request("other")
    is_valid = msg.get("valid", False)

    if ret_code != 200:
        return msg, ret_code

    if not is_valid:
        return jsonify({'message': 'User does not have permission'}), 403

    response = ""

    # Every user can search all crop types
    if request.method == "GET":
        try:
            ctype_list = []

            for row in CropType.query.all():
                ctype_list.append(row.to_json())

            if not ctype_list:
                return jsonify({'message': 'No crop type found'}), 404
            else:
                json_str = json.dumps(ctype_list)
                response = jsonify(json_str)
        except exc.SQLAlchemyError:
            return jsonify({'message': 'No crop type found'}), 404

    elif request.method == "POST":
        # Only admin can post new crop type,
        # new crop_type is added automatically by creating/updating crop field
        is_admin = msg.get("is_admin", False)
        if not is_admin:
            return jsonify({'message': 'User does not have permission'}), 403

        data = request.json
        ct_name = get_dict_value(data, 'name')
        ct_variety = get_dict_value(data, 'variety')

        if ct_name is None or ct_variety is None:
            return jsonify({'message': 'Missing required data'}), 400

        try:
            ct, is_created = get_or_create(db.session, CropType,
                                           name=ct_name, variety=ct_variety)
            if is_created:
                db.session.commit()
                response = jsonify({'message': 'Created', 'crop type': ct_name}), 201
            else:
                response = jsonify({'message': 'Crop type {} already exists'.format(ct_name)}), 201

        except exc.SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({'message': 'Failed to store crop type {} with error:\n{}'.format(ct_name, e)}), 400

    return response


@app.route(api_route_str + '/country_list', methods=['GET'])
def get_country_list():
    ret_code, msg = verify_request("other")
    is_valid = msg.get("valid", False)

    if ret_code != 200:
        return msg, ret_code

    if not is_valid:
        return jsonify({'message': 'User does not have permission'}), 403

    try:
        countries = []

        for row in Country.query.all():
            countries.append(row.to_json())

        if not countries:
            return jsonify({'message': 'No country found'}), 404
        else:
            json_str = json.dumps(countries)
            response = jsonify(json_str), 200
    except exc.SQLAlchemyError:
        return jsonify({'message': 'No country found'}), 404

    return response


@app.route(api_route_str + '/soil_types', methods=['GET'])
def get_soil_types():
    ret_code, msg = verify_request("other")
    is_valid = msg.get("valid", False)

    if ret_code != 200:
        return msg, ret_code

    if not is_valid:
        return jsonify({'message': 'User does not have permission'}), 403

    try:
        soil_list = []

        for row in SoilType.query.all():
            soil_list.append(row.to_json())

        if not soil_list:
            return jsonify({'message': 'No soil type found'}), 404
        else:
            json_str = json.dumps(soil_list)
            response = jsonify(json_str), 200
    except exc.SQLAlchemyError:
        return jsonify({'message': 'No soil type found'}), 404

    return response


@app.route(api_route_str + '/equipments', methods=['GET', 'POST'])
def get_equipments():
    response = ""
    farm_id = request.args.get('farm_id')

    if not farm_id:
        return jsonify({'message': 'Missing required data (farm_id)'}), 400

    ret_code, msg = verify_request("equipment", farm_id=farm_id)
    is_valid = msg.get("valid", False)

    if ret_code != 200:
        return msg, ret_code

    if not is_valid:
        return jsonify({'message': 'User does not have permission'}), 403

    if request.method == "GET":
        status_list = []
        if msg.get("is_admin", False):
            status_list = ["public", "private"]
        else:
            allowed_access = msg.get("allowed_access")
            if allowed_access:
                for access in allowed_access:
                    status = access.get("status")
                    if status:
                        if status == "private":
                            flist = get_accessible_farm_list(msg)
                            if flist and farm_id in flist:
                                status_list.append(status)
                        else:
                            status_list.append(status)

        if not len(status_list):
            return jsonify({'message': 'User does not have permission'}), 403

        eq_list = []

        try:
            for eq, ow, ac in db.session.query(Equipment, Owner, AccessibilityStatus) \
                    .filter(Equipment.owner_id == Owner.id,
                            Equipment.access_id == AccessibilityStatus.id) \
                    .filter(Owner.owner_type == OwnerType.FARM,
                            Owner.owned_by_farm_id == farm_id) \
                    .filter(AccessibilityStatus.name.in_(status_list)).all():
                eq_list.append(eq.to_json(ow, ac))

            if not eq_list:
                return jsonify({'message': 'No equipment found'}), 404

            json_str = json.dumps(eq_list)
            response = jsonify(json_str), 200
        except exc.SQLAlchemyError as e:
            return jsonify({'message': 'Failed to get equipments with error:\n{}'.format(e)}), 400

    elif request.method == "POST":
        data = request.json

        if not data:
            return jsonify({'message': 'No input data'}), 400

        name = data.get("name")
        description = data.get("description")
        model_id = data.get("model_id")
        man_date = data.get("manufacturing_date")
        serial_number = data.get("serial_number")
        accessibility = data.get("accessibility")

        if not name or not accessibility:
            return jsonify({'message': 'Missing required data'}), 400

        try:
            owner, is_created = get_or_create(db.session, Owner,
                                              owned_by_farm_id=farm_id,
                                              owned_by_user_id=None)

            if is_created:
                db.session.commit()

            access_msg, is_ok = get_access_id(accessibility)
            if not is_ok:
                return access_msg, 400

            equipment, is_created = get_or_create(db.session, Equipment,
                                                  name=name, model_id=model_id,
                                                  description=description,
                                                  manufacturing_date=man_date,
                                                  serial_number=serial_number,
                                                  owner_id=owner.id,
                                                  access_id=access_msg)

            if is_created:
                db.session.commit()
                response = jsonify({'message': 'Created', 'equipment': name, 'equipment_id': equipment.id}), 201
        except exc.SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({'message': 'Failed to store equipment {} with error:\n{}'.format(name, e)}), 400

    return response


@app.route(api_route_str + '/equipments/<equipment_id>', methods=['GET', 'PUT', 'DELETE'])
def get_equipment_by_id(equipment_id):
    response = ""
    farm_id = request.args.get('farm_id')

    if not farm_id:
        return jsonify({'message': 'Missing required data (farm_id)'}), 400

    ret_code, msg = verify_request("equipment", farm_id=farm_id)
    is_valid = msg.get("valid", False)

    if ret_code != 200:
        return msg, ret_code

    if not is_valid:
        return jsonify({'message': 'User does not have permission'}), 403

    if request.method == "GET":
        status_list = []
        if msg.get("is_admin", False):
            status_list = ["public", "private"]
        else:
            allowed_access = msg.get("allowed_access")
            if allowed_access:
                for access in allowed_access:
                    status = access.get("status")
                    if status:
                        if status == "private":
                            flist = get_accessible_farm_list(msg)
                            if flist and farm_id in flist:
                                status_list.append(status)
                        else:
                            status_list.append(status)

        if not len(status_list):
            return jsonify({'message': 'User does not have permission'}), 403

        try:
            eq, ow, ac = db.session.query(Equipment, Owner, AccessibilityStatus) \
                .filter(Equipment.owner_id == Owner.id,
                        Equipment.access_id == AccessibilityStatus.id,
                        Equipment.id == equipment_id) \
                .filter(Owner.owner_type == OwnerType.FARM,
                        Owner.owned_by_farm_id == farm_id) \
                .filter(AccessibilityStatus.name.in_(status_list)).first()
        except exc.SQLAlchemyError as e:
            return jsonify({'message': 'Failed to get equipment with error:\n{}'.format(e)}), 400

        if not eq or not ow or not ac:
            return jsonify({'message': 'No equipment found'}), 404

        json_str = json.dumps(eq.to_json(ow, ac))
        response = jsonify(json_str), 200

    elif request.method == "PUT":
        data = request.json

        if not data:
            return jsonify({'message': 'No input data'}), 400

        eq = Equipment.query.get(equipment_id)

        if not eq:
            return jsonify({'message': 'No equipment found'}), 404

        name = data.get("name")
        description = data.get("description")
        model_id = data.get("model_id")
        man_date = data.get("manufacturing_date")
        serial_number = data.get("serial_number")
        accessibility = data.get("accessibility")

        if accessibility:
            access_msg, is_ok = get_access_id(accessibility)
            if not is_ok:
                return access_msg, 400
            eq.access_id = access_msg

        if name and name != eq.name:
            # Check duplicate
            if Equipment.query.filter_by(name=name, owner_id=eq.owner_id).first():
                return jsonify({'message': 'Another equipment has same name'}), 400
            eq.name = name

        if model_id and model_id != eq.model_id:
            if MappingApi.get_equipment_model_id(model_id, g.auth_header):
                eq.model_id = model_id
            else:
                return jsonify({'message': 'Equipment model with ID {} not found'.format(model_id)}), 400

        eq.description = description
        eq.manufacturing_date = man_date
        eq.serial_number = serial_number

        try:
            db.session.commit()
        except exc.SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({'message': 'Failed to update equipment with error:\n{}'.format(e)}), 400

        response = jsonify({'message': 'Updated', 'name': eq.name}), 201

    elif request.method == "DELETE":
        if not Equipment.query.get(equipment_id):
            return jsonify({'message': 'No equipment found'}), 404
        else:
            db.session.query(Equipment).filter(Equipment.id == equipment_id).delete()
            db.session.commit()
            response = jsonify({'message': 'The equipment was deleted successfully'}), 204

    return response


@app.route(api_route_str + '/observations', methods=['GET', 'DELETE'])
def get_observations():
    context_type = request.args.getlist('type')
    farm_id = request.args.get('farm_id')
    field_id = request.args.get('field_id')
    crop_field_id = request.args.get('crop_field_id')
    equipment_id = request.args.get('equipment_id')

    if not farm_id or not field_id:
        return jsonify({'message': 'Missing required data'}), 400

    ret_code, msg = verify_request("observation", farm_id=farm_id)
    is_valid = msg.get("valid", False)

    if ret_code != 200:
        return msg, ret_code

    if not is_valid:
        return jsonify({'message': 'User does not have permission'}), 403

    params = {
        "context_type": context_type,
        "farm_id": farm_id,
        "field_id": field_id,
        "crop_field_id": crop_field_id,
        "equipment_id": equipment_id
    }

    if request.method == 'GET':
        status_list = []
        if msg.get("is_admin", False):
            status_list = ["public", "private"]
        else:
            allowed_access = msg.get("allowed_access")
            if allowed_access:
                for access in allowed_access:
                    status = access.get("status")
                    if status:
                        if status == "private":
                            flist = get_accessible_farm_list(msg)
                            if flist and farm_id in flist:
                                status_list.append(status)
                        else:
                            status_list.append(status)

        if not len(status_list):
            return jsonify({'message': 'User does not have permission'}), 403

        response = get_sensing_log(params, status_list)

    elif request.method == 'DELETE':
        try:
            query = db.session.query(ObservationLocation).filter(ObservationLocation.farm_id == farm_id)

            if field_id:
                query = query.filter(ObservationLocation.field_id == field_id)

            if crop_field_id:
                query = query.filter(ObservationLocation.crop_field_id == crop_field_id)

            query.delete()
            db.session.commit()
            response = jsonify({'message': 'The observation data was deleted successfully'}), 204
        except exc.SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({'message': 'Failed to delete with error:\n{}'.format(e)}), 400

    return response


@app.route(api_route_str + '/observations/access', methods=['PUT'])
def update_observation_access():
    # context_type = request.args.getlist('type')
    farm_id = request.args.get('farm_id')
    field_id = request.args.get('field_id')
    crop_field_id = request.args.get('crop_field_id')
    access = request.args.get('accessibility')

    if not farm_id \
            or not field_id\
            or not crop_field_id\
            or not access:
        return jsonify({'message': 'Missing required data'}), 400

    ret_code, msg = verify_request("observation", farm_id=farm_id)
    is_valid = msg.get("valid", False)

    if ret_code != 200:
        return msg, ret_code

    if not is_valid:
        return jsonify({'message': 'User does not have permission'}), 403

    access_id, is_ok = get_access_id(access)

    if not is_ok:
        return access_id, 400

    oloc = ObservationLocation.query.filter_by(farm_id=farm_id, field_id=field_id, crop_field_id=crop_field_id).first()

    if not oloc:
        return jsonify({'message': 'No observation found'}), 404

    oloc.access_id = access_id
    db.session.commit()
    response = jsonify({'message': 'Updated'}), 201

    return response


@app.route(api_route_str + '/observations/upload', methods=['POST'])
def upload_observations():
    farm_id = get_dict_value(request.form, 'farm_id')
    ret_code, msg = verify_request("observation",
                                   allow_internal=True,
                                   farm_id=farm_id)
    is_valid = msg.get("valid", False)

    if ret_code != 200:
        return msg, ret_code

    if not is_valid:
        return jsonify({'message': 'User does not have permission'}), 403

    if 'file' in request.files:
        file = request.files['file']

        map_id = get_dict_value(request.form, 'map_id')
        field_id = get_dict_value(request.form, 'field_id')
        crop_field_id = get_dict_value(request.form, 'crop_field_id')
        accessibility = get_dict_value(request.form, 'accessibility')
        equipment_id = get_dict_value(request.form, 'equipment_id')

        if (not map_id or
                not farm_id or
                not field_id or
                not accessibility):
            return jsonify({'message': 'Missing required data'}), 400

        datamap = MappingApi.get_datamap_by_id(map_id, g.auth_header)
        if not datamap:
            return jsonify({'message': 'Datamap ID {} not found'.format(map_id)}), 400

        if equipment_id:
            eq = Equipment.query.get(equipment_id)
            if not eq:
                return jsonify({'message': 'Equipment ID {} not found'.format(equipment_id)}), 400
        else:
            equipment_id = None

        ow, is_created = get_or_create(db.session, Owner,
                                       owned_by_farm_id=farm_id,
                                       owned_by_user_id=None)

        if is_created:
            db.session.commit()

        # Get location
        latitude_str = request.args.get('latitude')
        longitude_str = request.args.get('longitude')
        default_time = request.args.get('datetime')

        default_coordinate = {
            "latitude": latitude_str,
            "longitude": longitude_str
        }

        field_dict = {
            "farm_id": farm_id,
            "field_id": field_id,
            "crop_field_id": crop_field_id
        }

        response = store_observation(file, datamap,
                                     default_coordinate, field_dict,
                                     equipment_id, default_time,
                                     accessibility)
    else:
        return jsonify({'message': 'No file selected for uploading'}), 404

    return response


@app.route(api_route_str + '/observations/upload/test', methods=['POST'])
def test_upload_observations():
    farm_id = get_dict_value(request.form, 'farm_id')
    ret_code, msg = verify_request("observation",
                                   allow_internal=True,
                                   farm_id=farm_id)
    is_valid = msg.get("valid", False)

    if ret_code != 200:
        return msg, ret_code

    if not is_valid:
        return jsonify({'message': 'User does not have permission'}), 403

    if 'file' in request.files:
        file = request.files['file']
        response = jsonify({'message': 'ok uploading file'}), 201

    else:
        return jsonify({'message': 'No file selected for uploading'}), 404

    return response