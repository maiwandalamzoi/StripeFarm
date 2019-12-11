"""@package docstring
Model file that corresponds to all the data related logic
"""
from app import db
from sqlalchemy.dialects.postgresql import JSON
import enum


# Owner of datamap can be a farm or a user
class OwnerType(enum.Enum):
    FARM = "farm"
    USER = "user"


class EquipmentModel(db.Model):
    # __table_args__ = {'schema': 'datamap_model'}
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    brand_name = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(50), nullable=False)
    model_year = db.Column(db.Integer)
    series = db.Column(db.String(50))
    software_version = db.Column(db.String(50))
    description = db.Column(db.String(100))
    slug = db.Column(db.String(100), unique=True, nullable=False)
    datamaps = db.relationship("DataMap", backref="equipment_model", passive_deletes=False)

    def __init__(self, brand, model, model_year,
                 series, sw_version, desc, slug):
        self.brand_name = brand
        self.model = model
        self.model_year = model_year
        self.series = series
        self.software_version = sw_version
        self.description = desc
        self.slug = slug

    # def __repr__(self):
    #     return '<Brand {} Model {} Series {}>'.format(self.brand_name,
    #                                           self.model, self.series)

    def to_json(self):
        return {
            'id': self.id,
            'brand_name': self.brand_name,
            'model': self.model,
            'model_year': self.model_year,
            'series': self.series,
            'software_version': self.software_version,
            'description': self.description,
            'slug': self.slug
        }


class AccessibilityStatus(db.Model):
    # __table_args__ = {'schema': 'datamap_model'}
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)


class Owner(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    owner_type = db.Column(db.Enum(OwnerType), default=OwnerType.FARM,
                           nullable=False)
    owned_by_farm_id = db.Column(db.Integer)
    owned_by_user_id = db.Column(db.Integer)
    __table_args__ = (
        db.CheckConstraint('( CASE WHEN owned_by_farm_id is NULL THEN 0 ELSE 1 END'
                           ' + CASE WHEN owned_by_user_id is NULL THEN 0 ELSE 1 END'
                           ') = 1'),)
    # __table_args__ = (
    #     db.CheckConstraint('( CASE WHEN owned_by_farm_id is NULL THEN 0 ELSE 1 END'
    #                        ' + CASE WHEN owned_by_user_id is NULL THEN 0 ELSE 1 END'
    #                        ') = 1'),
    #     {'schema': 'datamap_model'})

    def __init__(self, owned_by_farm_id, owned_by_user_id):
        if owned_by_farm_id is not None:
            self.owner_type = OwnerType.FARM
            self.owned_by_farm_id = owned_by_farm_id
            self.owned_by_user_id = None
        elif owned_by_user_id is not None:
            self.owner_type = OwnerType.USER
            self.owned_by_farm_id = None
            self.owned_by_user_id = owned_by_user_id

    def to_json(self):
        if self.owner_type == OwnerType.FARM:
            owner_id = self.owned_by_farm_id
        else:
            owner_id = self.owned_by_user_id

        return {
            "owned_by": self.owner_type.value,
            "owner_id": owner_id
        }


class DataMap(db.Model):
    # __table_args__ = {'schema': 'datamap_model'}
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(50), index=True, unique=True, nullable=False)
    description = db.Column(db.String(100))
    has_header = db.Column(db.Boolean, nullable=False)
    has_coordinate = db.Column(db.Boolean, nullable=False)
    has_date = db.Column(db.Boolean, nullable=False)
    has_time = db.Column(db.Boolean, nullable=False)
    # model_id = db.Column(db.Integer, db.ForeignKey('equipment_model.id', ondelete='SET NULL'))
    model_id = db.Column(db.Integer, db.ForeignKey(EquipmentModel.id, ondelete='SET NULL'))
    maps = db.Column(JSON, nullable=False)
    # access_id = db.Column(db.Integer, db.ForeignKey('accessibility_status.id'), nullable=False)
    access_id = db.Column(db.Integer, db.ForeignKey(AccessibilityStatus.id), nullable=False)
    # owner_id = db.Column(db.Integer, db.ForeignKey('owner.id', ondelete='CASCADE'), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey(Owner.id, ondelete='CASCADE'), nullable=False)

    def __init__(self, name, description, has_header, has_coordinate, has_date,
                 has_time, model_id, maps, access_id, owner_id):
        self.name = name
        self.description = description
        self.has_header = has_header
        self.has_coordinate = has_coordinate
        self.has_date = has_date
        self.has_time = has_time
        self.model_id = model_id
        self.maps = maps
        self.access_id = access_id
        self.owner_id = owner_id

    def to_json(self, accessibility_str, owner):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'has_header': self.has_header,
            'has_coordinate': self.has_coordinate,
            'has_date': self.has_date,
            'has_time': self.has_time,
            'model_id': self.model_id,
            'maps': self.maps,
            'accessibility': accessibility_str,
            'owner': owner.to_json()
        }
