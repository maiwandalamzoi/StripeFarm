from app import db
from sqlalchemy_utils import EmailType, URLType
from sqlalchemy.dialects.postgresql import JSONB
from geoalchemy2 import Geometry
import enum


class ExtendedEnum(enum.Enum):
    @classmethod
    def list(cls):
        return list(map(lambda c: c.value, cls))


class ObservedContextType(ExtendedEnum):
    ENVIRONMENT = "environment"
    CROP = "crop"
    HARVEST = "harvest"
    TREATMENT = "treatment"


class OwnerType(ExtendedEnum):
    FARM = "farm"
    USER = "user"


class Farm(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    address = db.Column(db.String(100))
    postal_code = db.Column(db.String(20))
    country_id = db.Column(db.Integer, db.ForeignKey('country.id'))
    email = db.Column(EmailType)
    phone_number = db.Column(db.String(20))
    website = db.Column(URLType)
    access_id = db.Column(db.Integer, db.ForeignKey('accessibility_status.id'),
                          nullable=False)
    fields = db.relationship("Field", backref="farm", passive_deletes=True)
    crop_fields = db.relationship("CropField", backref="farm", passive_deletes=True)

    def __init__(self, name, access_id):
        self.name = name
        self.access_id = access_id

    def to_json(self, country, accessibility):
        if country:
            country_json = country.to_json()
        else:
            country_json = None

        return {
            'id': self.id,
            'name': self.name,
            'address': self.address,
            'postal_code': self.postal_code,
            'country': country_json,
            'email': self.email,
            'phone': self.phone_number,
            'webpage': self.website,
            'accessibility': str(accessibility)
        }


class Field(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    farm_id = db.Column(db.Integer, db.ForeignKey('farm.id', ondelete='CASCADE'))
    name = db.Column(db.String(50), nullable=False)
    area = db.Column(Geometry('POLYGON'))
    size_in_ha = db.Column(db.Float)
    soil_type_id = db.Column(db.Integer, db.ForeignKey('soil_type.id'))
    access_id = db.Column(db.Integer, db.ForeignKey('accessibility_status.id'), nullable=False)
    crop_fields = db.relationship("CropField", backref="field", passive_deletes=True)
    __table_args__ = (db.UniqueConstraint('farm_id', 'name',
                                          name='uix_field'),)

    def __init__(self, farm_id, name, area, size_in_ha, soil_type_id, access_id):
        self.farm_id = farm_id
        self.name = name
        self.area = area
        self.size_in_ha = size_in_ha
        self.soil_type_id = soil_type_id
        self.access_id = access_id

    def to_json(self, soil_type, accessibility):
        if soil_type:
            soil_json = soil_type.to_json()
        else:
            soil_json = None

        return {
            'id': self.id,
            'field_name': self.name,
            'coordinates': self.area,
            'size_in_hectare': self.size_in_ha,
            'soil_type': soil_json,
            'accessibility': str(accessibility)
        }


class CropField(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    farm_id = db.Column(db.Integer, db.ForeignKey('farm.id', ondelete='CASCADE'),
                        nullable=False)
    field_id = db.Column(db.Integer, db.ForeignKey('field.id', ondelete='CASCADE'),
                         nullable=False)
    crop_type_id = db.Column(db.Integer, db.ForeignKey('crop_type.id'),
                             nullable=False)
    period_start = db.Column(db.Date)
    period_end = db.Column(db.Date)
    area = db.Column(Geometry('POLYGON'), nullable=False)
    access_id = db.Column(db.Integer, db.ForeignKey('accessibility_status.id'), nullable=False)
    __table_args__ = (db.UniqueConstraint('farm_id', 'field_id', 'crop_type_id', 'period_start',
                                          'period_end', 'name', 'area',
                                          name='uix_crop_field'),)

    def __init__(self, name, farm_id, field_id, crop_type_id, period_start, period_end, area, access_id):
        self.name = name
        self.farm_id = farm_id
        self.field_id = field_id
        self.crop_type_id = crop_type_id
        self.period_start = period_start
        self.period_end = period_end
        self.area = area
        self.access_id = access_id

    def to_json(self, crop_type, accessibility):
        if crop_type:
            crop_json = crop_type.to_json()
        else:
            crop_json = None

        return {
            'id': self.id,
            'name': self.name,
            'farm_id': self.farm_id,
            'field_id': self.field_id,
            'crop_type': crop_json,
            'period_start': self.period_start,
            'period_end': self.period_end,
            'coordinates': self.area,
            'accessibility': str(accessibility)
        }


class CropType(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    variety = db.Column(db.String(50), nullable=False)
    __table_args__ = (db.UniqueConstraint('name', 'variety',
                                          name='uix_croptype'),)

    def __init__(self, name, variety):
        self.name = name
        self.variety = variety

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'variety': self.variety
        }


class SoilType(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(500))

    def __init__(self, name, description):
        self.name = name
        self.description = description

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description
        }


class Country(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    code = db.Column(db.String(3), unique=True, nullable=False)

    def __init__(self, name, code):
        self.name = name
        self.code = code

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code
        }


class ObservedContext(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    context_type = db.Column(db.Enum(ObservedContextType),
                             default=ObservedContextType.ENVIRONMENT,
                             nullable=False)
    context = db.Column(db.String(50), nullable=False)
    parameter_id = db.Column(db.Integer, db.ForeignKey('parameter_type.id'), nullable=False)
    observations = db.relationship('Observation', backref="observed_context")
    __table_args__ = (db.UniqueConstraint('context_type', 'context', 'parameter_id',
                                          name='uix_context'),)

    def __init__(self, context_type, context, parameter_id):
        self.context_type = context_type
        self.context = context
        self.parameter_id = parameter_id

    def to_json(self, param_type):
        if param_type:
            param = param_type.get_param()
        else:
            param = None

        return {
            'context_type': self.context_type.value,
            'context': self.context,
            'parameter': param
        }


class ObservationLocation(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    farm_id = db.Column(db.Integer, db.ForeignKey('farm.id', ondelete='CASCADE'))
    field_id = db.Column(db.Integer, db.ForeignKey('field.id', ondelete='CASCADE'))
    crop_field_id = db.Column(db.Integer, db.ForeignKey('crop_field.id', ondelete='CASCADE'))
    access_id = db.Column(db.Integer, db.ForeignKey('accessibility_status.id'), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('owner.id', ondelete='CASCADE'), nullable=False)
    observations = db.relationship("Observation", backref="observation_location", passive_deletes=True)
    __table_args__ = (db.UniqueConstraint('farm_id', 'field_id', 'crop_field_id', 'owner_id',
                                          name='uix_observation_loc'),)

    def __init__(self, farm_id, field_id, crop_field_id, access_id, owner_id):
        self.farm_id = farm_id
        self.field_id = field_id
        self.crop_field_id = crop_field_id
        self.access_id = access_id
        self.owner_id = owner_id


class Observation(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    observed_context_id = db.Column(db.Integer,
                                    db.ForeignKey('observed_context.id'),
                                    nullable=False,)
    eq_id = db.Column(db.Integer, nullable=True)
    conditions = db.Column(JSONB, nullable=True)
    location_id = db.Column(db.Integer, db.ForeignKey('observation_location.id', ondelete='CASCADE'), nullable=False)
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id'), nullable=False)
    logs = db.relationship("SensingLog", backref="observation", passive_deletes=True)
    __table_args__ = (db.UniqueConstraint('observed_context_id', 'conditions',
                                          name='uix_observation'),)

    def __init__(self, observed_context_id, eq_id,
                 conditions, location_id, unit_id):
        self.observed_context_id = observed_context_id
        self.eq_id = eq_id
        self.conditions = conditions
        self.location_id = location_id
        self.unit_id = unit_id


class SensingLog(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    observation_id = db.Column(db.Integer, db.ForeignKey('observation.id', ondelete='CASCADE'),
                               nullable=False)
    date_time = db.Column(db.DateTime, nullable=False)
    value = db.Column(db.Float, nullable=False)
    geo = db.Column(Geometry(geometry_type="POINT"))
    __table_args__ = (db.UniqueConstraint('observation_id', 'date_time', 'value', 'geo',
                                          name='uix_sensing'),)

    def __init__(self, obs_id, dtime, value, geo):
        self.observation_id = obs_id
        self.date_time = dtime
        self.value = value
        self.geo = geo


class Equipment(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(50), index=True, nullable=False)
    model_id = db.Column(db.Integer)
    description = db.Column(db.String(100))
    manufacturing_date = db.Column(db.DateTime)
    serial_number = db.Column(db.String(50))
    owner_id = db.Column(db.Integer, db.ForeignKey('owner.id', ondelete='CASCADE'), nullable=False)
    access_id = db.Column(db.Integer, db.ForeignKey('accessibility_status.id'), nullable=False)
    __table_args__ = (db.UniqueConstraint('name', 'owner_id',
                                          name='uix_equipment'),)

    def __init__(self, name, model_id, description,
                 manufacturing_date, serial_number, owner_id, access_id):
        self.name = name
        self.model_id = model_id
        self.description = description
        self.manufacturing_date = manufacturing_date
        self.serial_number = serial_number
        self.owner_id = owner_id
        self.access_id = access_id

    def to_json(self, owner, access):
        return {
            'id': self.id,
            'owner': owner.to_json(),
            'name': self.name,
            'description': self.description,
            'model_id': self.model_id,
            'manufacturing_date': self.manufacturing_date.strftime("%Y-%m-%d"),
            'serial_number': self.serial_number,
            'accessibility': str(access)
        }


class ParameterType(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    type = db.Column(db.String(50), unique=True, nullable=False)

    def __init__(self, type):
        self.type = type

    def get_param(self):
        return self.type

    def to_json(self):
        return {
            'id': self.id,
            'type': self.type
        }


class Unit(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    type_id = db.Column(db.Integer, db.ForeignKey('parameter_type.id'),
                        nullable=False)
    name = db.Column(db.String(50), unique=True, nullable=False)

    def __init__(self, type_id, name):
        self.type_id = type_id
        self.name = name


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

    def __init__(self, owned_by_farm_id, owned_by_user_id):
        if owned_by_farm_id is not None:
            self.owner_type = OwnerType.FARM
            self.owned_by_farm_id = owned_by_farm_id
        elif owned_by_user_id is not None:
            self.owner_type = OwnerType.USER
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


class AccessibilityStatus(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    def __init__(self, name):
        self.name = name

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name
        }

    def __str__(self):
        return self.name
