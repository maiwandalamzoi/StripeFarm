from app import db
from flask import jsonify
from .models import *
from sqlalchemy import exc


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


def method_to_permission(method):
    method_map = {
        'GET': 'read',
        'HEAD': 'read',
        'OPTIONS': 'read',
        'POST': 'create',
        'PATCH': 'update',
        'PUT': 'update',
        'DELETE': 'delete',
    }
    return method_map[method]


def create_role_permissions(session, permissions, role_id, role_name):
    for p in permissions:
        resource = p.get("resource", None)
        p_methods = p.get("methods", None)

        if resource is None or p_methods is None:
            return jsonify({'message': 'Missing required data in role permissions'}), 400

        # Get resource id
        resource_query, is_created = get_or_create(session, Resource,
                                                   name=resource)

        if is_created:
            session.commit()

        is_created = False
        for p_method in p_methods:
            permission_query, rp_created = get_or_create(session, RolePermission,
                                                         role_id=role_id,
                                                         permission_type=PermissionType(p_method),
                                                         resource_id=resource_query.id)

            is_created = is_created or rp_created

        if is_created:
            session.commit()

    return jsonify({'message': 'Created', 'role permission': role_name}), 200


def get_user_access(identity, resource, method):
    user_id = identity["user_id"]
    is_admin = identity["is_admin"]
    method = method_to_permission(method)

    response = {
        "valid": False,
        "allowed_access": None,
        "user_id": user_id,
        "is_admin": is_admin
    }

    allowed_access = []

    if is_admin:
        allowed_access.append({"status": "public"})
        allowed_access.append({"status": "private"})
        response["allowed_access"] = allowed_access
        response["valid"] = True
        return response

    resource_name = resource.get("name")
    resource_meta = resource.get("meta")
    if resource_meta:
        farm_id = resource_meta.get("farm_id")
    else:
        farm_id = None

    try:
        resource_type = ResourceType(resource_name)
    except ValueError:
        resource_list = [res.value for res in ResourceType]
        return jsonify({"message": "Resource type is not found. Available types: {}".format(resource_list)}), 404

    if not farm_id:
        # Check if Role is general user
        if not FarmUser.query.filter_by(user_id=user_id).first():
            # Role is general user
            if method == PermissionType.READ.value:
                if resource_type is ResourceType.FARM or \
                        resource_type is ResourceType.FIELD or \
                        resource_type is ResourceType.CROP_FIELD or \
                        resource_type is ResourceType.DATAMAP or \
                        resource_type is ResourceType.OBSERVATION or \
                        resource_type is ResourceType.EQUIPMENT or \
                        resource_type is ResourceType.OTHER:
                    allowed_access.append({"status": "public"})
                    response["valid"] = True
            elif method == PermissionType.CREATE.value:
                if resource_type is ResourceType.FARM or \
                        resource_type is ResourceType.DATAMAP:
                    response["valid"] = True

        # Role is other than general user
        else:
            # Get all available access permissions
            farm_list = []

            for fu in FarmUser.query.filter_by(user_id=user_id).all():
                try:
                    rl, pr, rs = db.session.query(Role, RolePermission, Resource) \
                        .filter(Role.id == fu.role_id) \
                        .filter(RolePermission.role_id == fu.role_id,
                                RolePermission.permission_type == PermissionType(method)) \
                        .filter(Resource.name == resource_type.value) \
                        .filter(RolePermission.resource_id == Resource.id) \
                        .first()
                except TypeError:
                    rl = pr = rs = None

                if pr:
                    farm_list.append(fu.farm_id)

            if len(farm_list):
                if method == PermissionType.READ.value:
                    access = {
                        "status": "private",
                        "farm_id": farm_list
                    }

                    allowed_access.append(access)
                    allowed_access.append({"status": "public"})

                response["valid"] = True

    # Get role permission from specific farm
    else:
        farm_exist = FarmUser.query.filter_by(farm_id=farm_id).first() is not None

        role = RoleType.USER.value
        if farm_exist:
            fu_query = FarmUser.query.filter_by(user_id=user_id, farm_id=farm_id).first()

            if fu_query:
                role_query = Role.query.get(fu_query.role_id)
                role = role_query.name

        if role == RoleType.USER.value:
            if method == PermissionType.READ.value:
                if (resource_type is ResourceType.FARM or
                        resource_type is ResourceType.FIELD or
                        resource_type is ResourceType.CROP_FIELD or
                        resource_type is ResourceType.DATAMAP or
                        resource_type is ResourceType.OBSERVATION or
                        resource_type is ResourceType.EQUIPMENT or
                        resource_type is ResourceType.OTHER):
                    allowed_access.append({"status": "public"})
                    response["valid"] = True
            elif method == PermissionType.CREATE.value:
                if not farm_exist and (resource_type is ResourceType.FARM or
                                       resource_type is ResourceType.FARM_USER):
                    response["valid"] = True
        # User has a role in this farm
        else:
            if fu_query:
                try:
                    pr, rs = db.session.query(RolePermission, Resource).join(Resource) \
                        .filter(RolePermission.role_id == fu_query.role_id,
                                RolePermission.permission_type == PermissionType(method)) \
                        .filter(Resource.name == resource_type.value) \
                        .first()
                except TypeError:
                    pr = rs = None

                # Access allowed
                if pr and rs:
                    if method == PermissionType.READ.value:
                        access = {
                            "status": "private",
                            "farm_id": [farm_id]
                        }
                        allowed_access.append(access)
                        allowed_access.append({"status": "public"})
                    response["valid"] = True

    response["allowed_access"] = allowed_access
    return response


def filter_dict_status_list(status, dict_list):
    res = None

    if dict_list and dict_list["allowed_access"]:
        ret_list = list(filter(lambda res: res['status'] == status, dict_list["allowed_access"]))
        if ret_list:
            res = ret_list[0]

    return res
