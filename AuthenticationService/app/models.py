from app import db
from sqlalchemy_utils import EmailType, URLType
from sqlalchemy.dialects.postgresql import JSONB
import datetime
import enum


class RoleType(enum.Enum):
    SYSADMIN = "admin"
    FARM_ADMIN = "farm_admin"
    FARMER = "farmer"
    RESEARCHER = "researcher"
    USER = "user"


class PermissionType(enum.Enum):
    CREATE = "create"
    READ = "read"
    UPDATE = "update"
    DELETE = "delete"


class ResourceType(enum.Enum):
    FARM = "farm"
    FIELD = "field"
    CROP_FIELD = "crop_field"
    OBSERVATION = "observation"
    EQUIPMENT = "equipment"
    DATAMAP = "datamap"
    FARM_USER = "farm_user"
    OTHER = "other"


class User(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    email = db.Column(EmailType, unique=True, nullable=False)
    password = db.Column(db.Binary(60), nullable=False)
    created_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    farm_users = db.relationship("FarmUser", backref="user", passive_deletes=True)

    def __init__(self, email, password):
        self.email = email
        self.password = password

    def to_json(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            # 'password': str(self.password),
            'email': self.email,
            'created_date': self.created_date
        }


class FarmUser(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    farm_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id', ondelete='CASCADE'), nullable=False)
    field = db.Column(JSONB)

    __table_args__ = (db.UniqueConstraint('farm_id', 'user_id', 'role_id',
                                          name='uix_farm_user'),)

    def __init__(self, farm_id, user_id, role_id):
        self.farm_id = farm_id
        self.user_id = user_id
        self.role_id = role_id

    def to_json(self, role):
        return {
            'user_id': self.user_id,
            'role': role.to_json(),
        }


class Role(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    role_permissions = db.relationship("RolePermission", backref="role", lazy='dynamic', passive_deletes=True)

    def __init__(self, name):
        self.name = name

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name
        }

    def __str__(self):
        return self.name


class Resource(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(50),
                     nullable=False, unique=True)
    role_permissions = db.relationship("RolePermission", backref="resource", lazy='dynamic', passive_deletes=True)

    def __init__(self, name):
        self.name = name


class RolePermission(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id', ondelete='CASCADE'), nullable=False)
    permission_type = db.Column(db.Enum(PermissionType), nullable=False)
    resource_id = db.Column(db.Integer, db.ForeignKey('resource.id', ondelete='CASCADE'), nullable=False)

    __table_args__ = (db.UniqueConstraint('role_id', 'permission_type', 'resource_id',
                                          name='uix_role_permission'),)

    def __init__(self, role_id, permission_type, resource_id):
        self.role_id = role_id
        self.permission_type = permission_type
        self.resource_id = resource_id
