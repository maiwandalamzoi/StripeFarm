from app.models import db, Unit, ParameterType


def get_length_units():
    unit_type = 'length/height/depth'
    units = ['millimeter',
             'centimeter',
             'meter',
             'kilometer',
             'inch',
             'yard',
             'mile']
    return units, unit_type


def get_area_units():
    unit_type = 'area'
    units = ['square kilometer',
             'square meter',
             'hectare',
             'acre']
    return units, unit_type


def get_temperature_units():
    unit_type = 'temperature'
    units = ['Celsius',
             'Fahrenheit',
             'Kelvin']
    return units, unit_type


def get_mass_units():
    unit_type = 'mass'
    units = ['kilogram',
             'gram',
             'tonne',
             'pound',
             'ounce']
    return units, unit_type


def get_speed_units():
    unit_type = 'speed'
    units = ['m/s',
             'km/h',
             'mph',
             'ft/s']
    return units, unit_type


def get_precipitation_units():
    unit_type = 'precipitation'
    units = ['millimeter (ltr/m2)']
    return units, unit_type


def get_moisture_units():
    unit_type = 'moisture'
    units = ['mg/L']
    return units, unit_type


def get_unit_type(type_name):
    return ParameterType.query.filter(ParameterType.type == type_name).first()


def store_units(unit_list, type_name):
    type_record = get_unit_type(type_name)

    if type_record is None:
        print("Error: Unit type " + type_name + " is not found.\n")
    else:
        for unit in unit_list:
            unit_record = Unit.query.filter(Unit.name == unit).first()

            if unit_record is None:
                unit_record = Unit(type_record.id, unit)
                db.session.add(unit_record)
                db.session.commit()
            else:
                print("Unit " + unit + " of " + type_name +
                      " measurement has already been added. Skipping\n")


def store_measurement_units(unit_list, type_name):
    record = get_unit_type(type_name)

    if record is None:
        record = ParameterType(type_name)
        db.session.add(record)
        db.session.commit()

    store_units(unit_list, type_name)


def run():
    units, unit_type = get_length_units()
    store_measurement_units(units, unit_type)

    units, unit_type = get_area_units()
    store_measurement_units(units, unit_type)

    units, unit_type = get_temperature_units()
    store_measurement_units(units, unit_type)

    units, unit_type = get_mass_units()
    store_measurement_units(units, unit_type)

    units, unit_type = get_speed_units()
    store_measurement_units(units, unit_type)

    units, unit_type = get_precipitation_units()
    store_measurement_units(units, unit_type)

    units, unit_type = get_moisture_units()
    store_measurement_units(units, unit_type)


if __name__ == '__main__':
    run()
