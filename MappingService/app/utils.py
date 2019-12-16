from flask import jsonify
from app import db
from .models import EquipmentModel, DataMap, AccessibilityStatus, Owner, OwnerType
from sqlalchemy import exc
from slugify import slugify


def create_datamap(data, owner):
    # Check if same name already exists in database
    name = get_dict_value(data, 'name')
    if DataMap.query.filter_by(name=name).first():
        return jsonify({'message': 'Data map name already exists in database'}), 400

    description = get_dict_value(data, 'description')
    has_header = get_dict_value(data, 'has_header')
    has_coordinate = get_dict_value(data, 'has_coordinate')
    has_date = get_dict_value(data, 'has_date')
    has_time = get_dict_value(data, 'has_time')
    maps = get_dict_value(data, 'maps')
    access = get_dict_value(data, 'accessibility')

    if access is None:
        access = "public"

    model_id = get_dict_value(data, 'model_id')
    # Check if equipment model exists in database
    if model_id:
        if EquipmentModel.query.get(model_id) is None:
            return jsonify({'message': 'Model ID {} for the data map does not exist'.format(model_id)}), 400

    owner_type = owner["owned_by"]
    if owner_type == OwnerType.FARM:
        farm_id = owner["owner_id"]
        user_id = None
    else:
        farm_id = None
        user_id = owner["owner_id"]

    ow, is_created = get_or_create(db.session, Owner,
                                   owned_by_farm_id=farm_id,
                                   owned_by_user_id=user_id)

    if is_created:
        db.session.commit()

    owner_id = ow.id

    # Get access ID
    access_query, is_created = get_or_create(db.session, AccessibilityStatus, name=access)

    if is_created:
        db.session.commit()

    try:
        datamap = DataMap(name,
                          description,
                          has_header,
                          has_coordinate,
                          has_date,
                          has_time,
                          model_id,
                          maps,
                          access_query.id,
                          owner_id)

        db.session.add(datamap)
        db.session.commit()
        response = jsonify({'message': 'Created', 'datamap': datamap.name, "map_id": datamap.id}), 201

    except exc.SQLAlchemyError as e:
        db.session.rollback()
        response = jsonify({'message': 'Failed to store datamap {} with error:\n{}'.format(name, e)}), 400

    return response


def create_equipment_model(data):
    try:
        brand_name = data['brand_name']
        eq_model = data['model']
        model_year = data['model_year']
        series = data['series']
        sw_version = data['software_version']
        description = data['description']

        slug = create_model_slug(brand_name,
                                 eq_model,
                                 model_year,
                                 series,
                                 sw_version)

        model = EquipmentModel(brand_name,
                               eq_model,
                               model_year,
                               series,
                               sw_version,
                               description,
                               slug)

        # Check if same name already exists in database
        if EquipmentModel.query.filter(EquipmentModel.slug == slug).first() is None:
            model.slug = slug
        else:
            return jsonify({'message': 'Equipment model already exists in database'}), 400

        db.session.add(model)
        db.session.commit()

        response = jsonify({'message': 'Created', 'model': model.slug, 'model_id': model.id}), 201
    except KeyError:
        return jsonify({'message': 'Missing required data'}), 400

    return response


def create_model_slug(brand, model, model_year, series, sw_version):
    text = "{} {} {} {} {}".format(brand,
                                   model,
                                   model_year,
                                   series,
                                   sw_version)
    return slugify(text)


def get_dict_value(input_dict, key, subkey=None):
    val = None

    if key in input_dict:
        sub_dict = input_dict[key]
        if subkey:
            if subkey in sub_dict:
                val = sub_dict[subkey]
        else:
            val = sub_dict

    return val


def get_or_create(session, model, **kwargs):
    """
    Creates an object or returns the object if exists
    """
    instance = session.query(model).filter_by(**kwargs).first()
    if instance:
        return instance, False
    else:
        instance = model(**kwargs)
        session.add(instance)
        return instance, True
