from flask import request, jsonify, json, g
from app import app, db
from .models import EquipmentModel, DataMap, Owner, OwnerType
# from sqlalchemy import exc
from .utils import *
from .api.AuthApi import AuthApi


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


def verify_request(resource, **kwargs):
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


@app.route('/api/datamaps', methods=['GET', 'POST'])
def datamaps():
    ret_code, msg = verify_request("datamap")
    user_id = msg.get("user_id")

    is_valid = msg.get("valid", False)
    if ret_code != 200:
        return msg, ret_code

    if not is_valid:
        return jsonify({'message': 'User does not have permission'}), 403

    if request.method == 'GET':
        # Get all datamaps
        try:
            maps = []

            if msg.get("is_admin"):
                for dm, ac, ow in db.session.query(DataMap, AccessibilityStatus, Owner) \
                        .filter(DataMap.access_id == AccessibilityStatus.id,
                                DataMap.owner_id == Owner.id).all():
                    maps.append(dm.to_json(ac.name, ow))
            else:
                # Get all own datamap
                access_status = "private"
                for dm, ac, ow in db.session.query(DataMap, AccessibilityStatus, Owner) \
                        .filter(DataMap.access_id == AccessibilityStatus.id,
                                DataMap.owner_id == Owner.id) \
                        .filter(Owner.owner_type == OwnerType.USER,
                                Owner.owned_by_user_id == user_id) \
                        .filter(AccessibilityStatus.name == access_status).all():
                    maps.append(dm.to_json(ac.name, ow))

                # Get all accessible private datamaps owned by farms
                flist = get_accessible_farm_list(msg)
                if flist:
                    for dm, ac, ow in db.session.query(DataMap, AccessibilityStatus, Owner) \
                            .filter(DataMap.access_id == AccessibilityStatus.id,
                                    DataMap.owner_id == Owner.id) \
                            .filter(Owner.owner_type == OwnerType.FARM,
                                    Owner.owned_by_farm_id.in_(flist)) \
                            .filter(AccessibilityStatus.name == access_status).all():
                        maps.append(dm.to_json(ac.name, ow))

                # Public datamap
                access_status = "public"
                for dm, ac, ow in db.session.query(DataMap, AccessibilityStatus, Owner) \
                        .filter(DataMap.access_id == AccessibilityStatus.id,
                                DataMap.owner_id == Owner.id) \
                        .filter(AccessibilityStatus.name == access_status).all():
                    maps.append(dm.to_json(ac.name, ow))

            if not maps:
                return jsonify({'message': 'No data map found'}), 404
            else:
                json_str = json.dumps(maps)
                response = jsonify(json_str)
        except exc.SQLAlchemyError:
            return jsonify({'message': 'No data map found'}), 404

    elif request.method == "POST":
        data = request.json
        farm_id = request.args.get('farm_id')
        owner = {
            "owned_by": None,
            "owner_id": None
        }

        if farm_id:
            owner["owned_by"] = OwnerType.FARM
            owner["owner_id"] = farm_id
        else:
            owner["owned_by"] = OwnerType.USER
            owner["owner_id"] = user_id

        response = create_datamap(data, owner)
    else:
        return jsonify({'message': 'Method is not supported'}), 404

    return response


@app.route('/api/datamaps/<map_id>', methods=['GET', 'PUT', 'DELETE'])
def datamap_by_id(map_id):
    datamap = DataMap.query.get(map_id)

    if datamap is None:
        return jsonify({'message': 'The selected map does not exist'}), 404

    # Get datamap owner
    ow_query = Owner.query.get(datamap.owner_id)

    farm_owner_id = None
    if ow_query.owner_type == OwnerType.FARM:
        farm_owner_id = ow_query.owned_by_farm_id

    ret_code, msg = verify_request("datamap", farm_id=farm_owner_id)
    is_valid = msg.get("valid", False)
    if ret_code != 200:
        return msg, ret_code

    if not is_valid:
        return jsonify({'message': 'User does not have permission'}), 403

    if request.method == 'GET':
        access = AccessibilityStatus.query.get(datamap.access_id)

        is_allowed = False
        if access.name != "public":
            if msg.get("is_admin"):
                is_allowed = True
            elif ow_query.owner_type == OwnerType.USER:
                user_id = msg.get("user_id")
                # Resource is owned by the user
                if ow_query.owned_by_user_id == user_id:
                    is_allowed = True
            elif ow_query.owner_type == OwnerType.FARM:
                # allowed_access = msg.get("allowed_access")
                flist = get_accessible_farm_list(msg)

                if flist and ow_query.owned_by_farm_id in flist:
                    is_allowed = True
        else:
            is_allowed = True

        if is_allowed:
            response = jsonify(datamap.to_json(access.name, ow_query)), 200
        else:
            return jsonify({'message': 'User does not have permission'}), 403

    elif request.method == 'PUT':
        data = request.json

        if ow_query.owner_type == OwnerType.USER:
            user_id = msg.get("user_id")
            # Resource is not owned by the user
            if ow_query.owned_by_user_id != user_id:
                return jsonify({'message': 'User does not have permission'}), 403

        try:
            any_changes = False

            if datamap.name != data['name']:
                if DataMap.query.filter_by(name=data['name']).first():
                    return jsonify({'message': 'Data map name already exists in database'}), 400
                else:
                    any_changes = True
                    datamap.name = data['name']

            description = get_dict_value(data, 'description')
            if description != datamap.description:
                any_changes = True
                datamap.description = description

            has_header = get_dict_value(data, 'has_header')
            if has_header != datamap.has_header:
                any_changes = True
                datamap.has_header = has_header

            has_coor = get_dict_value(data, 'has_coordinate')
            if has_coor != datamap.has_coordinate:
                any_changes = True
                datamap.has_coordinate = has_coor

            has_date = get_dict_value(data, 'has_date')
            if has_date != datamap.has_date:
                any_changes = True
                datamap.has_date = has_date

            has_time = get_dict_value(data, 'has_time')
            if has_time != datamap.has_time:
                any_changes = True
                datamap.has_time = has_time

            maps = get_dict_value(data, 'maps')
            if maps != datamap.maps:
                any_changes = True
                datamap.maps = maps

            access = get_dict_value(data, 'accessibility')
            if access is None:
                access = "public"

            access_query, is_created = get_or_create(db.session, AccessibilityStatus, name=access)

            if is_created:
                db.session.commit()

            datamap.access_id = access_query.id

            if 'model_id' in data:
                if datamap.model_id != data['model_id']:
                    if EquipmentModel.query.get(data['model_id']):
                        any_changes = True
                        datamap.model_id = data['model_id']
                    else:
                        return jsonify({'message': 'Model ID for the data map does not exist'}), 400

            if any_changes:
                db.session.commit()
            response = jsonify({'message': 'Updated', 'datamap': datamap.name}), 201
        except KeyError:
            return jsonify({'message': 'Missing required data'}), 400

    elif request.method == 'DELETE':
        if ow_query.owner_type == OwnerType.USER:
            user_id = msg.get("user_id")
            # Resource is not owned by the user
            if ow_query.owned_by_user_id != user_id:
                return jsonify({'message': 'User does not have permission'}), 403

        db.session.query(DataMap).filter(DataMap.id == map_id).delete()
        db.session.commit()
        response = jsonify({'message': 'The data map was deleted successfully'}), 204
    else:
        return jsonify({'message': 'Method is not supported'}), 404

    return response


@app.route('/api/datamaps/models', methods=['GET', 'POST'])
def equipment_models():
    ret_code, msg = verify_request("other")

    # is_valid = msg.get("valid", False)
    if ret_code != 200:
        return msg, ret_code

    # if not is_valid:
    #     return jsonify({'message': 'User does not have permission'}), 403

    if request.method == 'GET':
        try:
            models = []
            for row in EquipmentModel.query.order_by(EquipmentModel.brand_name).all():
                models.append(row.to_json())

            if not models:
                return jsonify({'message': 'No equipment model found'}), 404
            else:
                json_str = json.dumps(models)
                response = jsonify(json_str)
        except exc.SQLAlchemyError:
            return jsonify({'message': 'No equipment model found'}), 404

    elif request.method == 'POST':
        data = request.json
        response = create_equipment_model(data)
    else:
        return jsonify({'message': 'Method is not supported'}), 404

    return response


@app.route('/api/datamaps/models/<slug>', methods=['GET', 'PUT', 'DELETE'])
def equipment_model_by_slug(slug):
    ret_code, msg = verify_request("other")
    is_valid = msg.get("valid", False)

    if ret_code != 200:
        return msg, ret_code

    if not is_valid:
        return jsonify({'message': 'User does not have permission'}), 403

    model = EquipmentModel.query.filter_by(slug=slug).first()

    if request.method == 'GET':
        if model is None:
            return jsonify({'message': 'The selected model does not exist'}), 404
        else:
            response = jsonify(model.to_json()), 200

    elif request.method == 'PUT':
        data = request.json

        if model is None:
            response = create_equipment_model(data)
        else:
            try:
                brand_name = data['brand_name']
                eq_model = data['model']
                model_year = data['model_year']
                series = data['series']
                software_version = data['software_version']
                description = data['description']

                new_slug = create_model_slug(brand_name,
                                             eq_model,
                                             model_year,
                                             series,
                                             software_version)

                # Check if new slug already exists, slug must be unique
                if new_slug != slug:
                    new_model = EquipmentModel.query.filter(EquipmentModel.slug == new_slug).first()

                    if new_model is not None:
                        return jsonify({'message': 'Equipment model already exists'}), 400

                model.brand_name = brand_name
                model.model = eq_model
                model.model_year = model_year
                model.series = series
                model.software_version = software_version
                model.description = description
                model.slug = new_slug

                db.session.commit()
                response = jsonify({'message': 'Updated', 'model': model.slug}), 201
            except KeyError:
                return jsonify({'message': 'Missing required data'}), 400

    elif request.method == 'DELETE':
        if model is None:
            return jsonify({'message': 'Equipment model not found'}), 404
        else:
            db.session.query(EquipmentModel).filter(EquipmentModel.slug == slug).delete()
            db.session.commit()
            response = jsonify({'message': 'The equipment model was deleted successfully'}), 204
    else:
        return jsonify({'message': 'Method is not supported'}), 404

    return response


@app.route('/api/datamaps/models/id/<model_id>', methods=['GET', 'PUT', 'DELETE'])
def equipment_model_by_id(model_id):
    ret_code, msg = verify_request("other")
    is_valid = msg.get("valid", False)

    if ret_code != 200:
        return msg, ret_code

    if not is_valid:
        return jsonify({'message': 'User does not have permission'}), 403

    model = EquipmentModel.query.get(model_id)
    if model is None:
        return jsonify({'message': 'The selected model does not exist'}), 404

    if request.method == 'GET':
        response = jsonify(model.to_json()), 200

    elif request.method == 'PUT':
        data = request.json

        try:
            brand_name = data['brand_name']
            eq_model = data['model']
            model_year = data['model_year']
            series = data['series']
            software_version = data['software_version']
            description = data['description']

            new_slug = create_model_slug(brand_name,
                                         eq_model,
                                         model_year,
                                         series,
                                         software_version)

            # Check if new slug already exists, slug must be unique
            found_model = EquipmentModel.query.filter(EquipmentModel.slug == new_slug).first()

            if found_model:
                if found_model.id != model.id:
                    return jsonify({'message': 'Equipment model already exists'}), 400

            model.brand_name = brand_name
            model.model = eq_model
            model.model_year = model_year
            model.series = series
            model.software_version = software_version
            model.description = description
            model.slug = new_slug

            db.session.commit()
            response = jsonify({'message': 'Updated', 'model': model.slug, 'model_id': model_id}), 201
        except KeyError:
            return jsonify({'message': 'Missing required data'}), 400

    elif request.method == 'DELETE':
        if model is None:
            return jsonify({'message': 'Equipment model not found'}), 404
        else:
            db.session.query(EquipmentModel).filter(EquipmentModel.id == model_id).delete()
            db.session.commit()
            response = jsonify({'message': 'The equipment model was deleted successfully'}), 204
    else:
        return jsonify({'message': 'Method is not supported'}), 404

    return response
