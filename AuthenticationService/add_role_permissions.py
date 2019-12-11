from app import db
from app.models import (Role, RolePermission, PermissionType,
                        Resource, ResourceType, RoleType)


def add_role(role_name, permissions):
    role = Role.query.filter(Role.name == role_name).first()

    # Remove all permissions for current role
    if role:
        db.session.query(Role).filter(Role.id == role.id).delete()
        db.session.commit()

    role = Role(role_name)
    db.session.add(role)
    db.session.commit()

    role_id = role.id
    add_role_permissions(role_id, permissions)


def add_role_permissions(role_id, permissions):
    for permission, resource in permissions:
        rs_query = Resource.query.filter_by(name=resource).first()

        if rs_query is None:
            rs_query = Resource(resource)
            db.session.add(rs_query)
            db.session.commit()

        rs_id = rs_query.id
        permission_type = PermissionType(permission)

        pr_query = RolePermission.query.filter_by(role_id=role_id,
                                                  permission_type=permission_type,
                                                  resource_id=rs_id).first()

        if pr_query is None:
            pr_query = RolePermission(role_id=role_id,
                                      permission_type=permission_type,
                                      resource_id=rs_id)
            db.session.add(pr_query)
            db.session.commit()


def add_system_admin_permissions():
    role = RoleType.SYSADMIN.value
    print("Set {} permissions".format(role))

    permission_list = []
    resource_list = [ResourceType.FARM,
                     ResourceType.FIELD,
                     ResourceType.CROP_FIELD,
                     ResourceType.DATAMAP,
                     ResourceType.EQUIPMENT,
                     ResourceType.OBSERVATION,
                     ResourceType.FARM_USER,
                     ResourceType.OTHER]

    for resource in resource_list:
        permission_list.append(('create', resource.value))
        permission_list.append(('read', resource.value))
        permission_list.append(('update', resource.value))
        permission_list.append(('delete', resource.value))

    add_role(role, permission_list)


def add_farm_admin_permissions():
    role = RoleType.FARM_ADMIN.value
    print("Set {} permissions".format(role))

    permission_list = []
    permission_list.append(('read', ResourceType.OTHER.value))

    resource_list = [ResourceType.FARM,
                     ResourceType.FIELD,
                     ResourceType.CROP_FIELD,
                     ResourceType.DATAMAP,
                     ResourceType.EQUIPMENT,
                     ResourceType.OBSERVATION,
                     ResourceType.FARM_USER]

    for resource in resource_list:
        permission_list.append(('create', resource.value))
        permission_list.append(('read', resource.value))
        permission_list.append(('update', resource.value))
        permission_list.append(('delete', resource.value))

    add_role(role, permission_list)


def add_farmer_permissions():
    role = RoleType.FARMER.value
    print("Set {} permissions".format(role))

    permission_list = []

    permission_list.append(('read', ResourceType.FARM.value))
    permission_list.append(('read', ResourceType.OTHER.value))

    resource_list = [ResourceType.FIELD,
                     ResourceType.CROP_FIELD,
                     ResourceType.DATAMAP,
                     ResourceType.EQUIPMENT,
                     ResourceType.OBSERVATION]

    for resource in resource_list:
        permission_list.append(('create', resource.value))
        permission_list.append(('read', resource.value))
        permission_list.append(('update', resource.value))
        permission_list.append(('delete', resource.value))

    add_role(role, permission_list)


def add_researcher_permissions():
    role = RoleType.RESEARCHER.value
    print("Set {} permissions".format(role))

    permission_list = []

    resource_list = [ResourceType.FARM,
                     ResourceType.FIELD,
                     ResourceType.CROP_FIELD,
                     ResourceType.DATAMAP,
                     ResourceType.EQUIPMENT,
                     ResourceType.OBSERVATION,
                     ResourceType.OTHER]

    for resource in resource_list:
        permission_list.append(('read', resource.value))

    resource = ResourceType.OBSERVATION
    permission_list.append(('create', resource.value))
    permission_list.append(('update', resource.value))
    # permission_list.append(('delete', resource.value))

    add_role(role, permission_list)


def add_user_permissions():
    role = RoleType.USER.value
    print("Set {} permissions".format(role))

    permission_list = []

    resource_list = [ResourceType.FARM,
                     ResourceType.FIELD,
                     ResourceType.CROP_FIELD,
                     ResourceType.DATAMAP,
                     ResourceType.EQUIPMENT,
                     ResourceType.OBSERVATION,
                     ResourceType.OTHER]

    for resource in resource_list:
        permission_list.append(('read', resource.value))

    permission_list.append(('create', ResourceType.FARM.value))
    permission_list.append(('create', ResourceType.DATAMAP.value))

    add_role(role, permission_list)


if __name__ == '__main__':
    add_system_admin_permissions()
    add_farm_admin_permissions()
    add_farmer_permissions()
    add_researcher_permissions()
    add_user_permissions()
