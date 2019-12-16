from app import db
from flask import jsonify, json
from sqlalchemy import exc, and_, or_
from werkzeug.utils import secure_filename
import dateutil.parser as dtparse
import csv
from shapely import wkb
from io import StringIO
import pandas as pd
import numpy as np
from .models import *
# from timeit import default_timer as timer


def get_access_id(status):
    if status is None:
        return jsonify({'message': 'Accessibility status is missing.'}), False

    try:
        access_query = AccessibilityStatus.query.filter_by(name=status).first()

        if not access_query:
            access_all = AccessibilityStatus.query.all()
            return jsonify({'message': 'Accessibility status {} not found. Available: {}'
                           .format(status, [res.name for res in access_all])}), False
    except exc.SQLAlchemyError as e:
        return jsonify({'message': 'Failed to get access status {} with error:\n{}'.format(status, e)}), False

    return access_query.id, True


def create_farm(data):
    farm_name = get_dict_value(data, 'name')
    access = get_dict_value(data, 'accessibility')

    if farm_name is None or access is None:
        return jsonify({'message': 'Missing required data'}), 400

    access_response, is_ok = get_access_id(access)
    if not is_ok:
        return access_response, 400

    try:
        farm_query, is_created = get_or_create(db.session, Farm,
                                               name=farm_name,
                                               access_id=access_response)

        if is_created:
            farm_query.address = get_dict_value(data, 'address')
            farm_query.postal_code = get_dict_value(data, 'postal_code')
            farm_query.country_id = get_dict_value(data, 'country_id')
            farm_query.email = get_dict_value(data, 'email')
            farm_query.phone_number = get_dict_value(data, 'phone')
            farm_query.website = get_dict_value(data, 'webpage')

            db.session.commit()
            response = jsonify({'message': 'Created', 'farm_id': farm_query.id}), 201
        else:
            response = jsonify({'message': 'Farm name {} already exists'.format(farm_name)}), 400
    except exc.SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to store farm {} with error:\n{}'.format(farm_name, e)}), 400

    return response


def create_field(farm_id, data):
    field_name = get_dict_value(data, 'field_name')
    coordinates = get_dict_value(data, 'coordinates')
    field_size = get_dict_value(data, 'size_in_hectare')
    soil_type_id = get_dict_value(data, 'soil_type_id')
    access = get_dict_value(data, 'accessibility')
    area = to_geo_string(coordinates, geo_type='POLYGON')

    access_response, is_ok = get_access_id(access)
    if not is_ok:
        return access_response, 400

    try:
        field_query, is_created = get_or_create(db.session, Field,
                                                farm_id=farm_id, name=field_name,
                                                area=area, size_in_ha=field_size,
                                                soil_type_id=soil_type_id,
                                                access_id=access_response)

        if is_created:
            db.session.commit()
    except exc.SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to store field {} with error:\n{}'.format(field_name, e)}), 400

    return jsonify({'message': 'Created', 'field_id': field_query.id}), 201


def create_crop_field(farm_id, field_id, data):
    name = get_dict_value(data, 'name')
    crop_type_id = get_dict_value(data, 'crop_type_id')

    period_start = get_dict_value(data, 'period_start')
    period_end = get_dict_value(data, 'period_end')

    coordinates = get_dict_value(data, 'coordinates')
    area = to_geo_string(coordinates, geo_type='POLYGON')

    access = get_dict_value(data, 'accessibility')
    access_response, is_ok = get_access_id(access)
    if not is_ok:
        return access_response, 400

    try:
        crop_query, is_created = get_or_create(db.session, CropField,
                                               name=name, farm_id=farm_id,
                                               field_id=field_id,
                                               crop_type_id=crop_type_id,
                                               period_start=period_start,
                                               period_end=period_end,
                                               area=area,
                                               access_id=access_response)

        if is_created:
            db.session.commit()
            response = jsonify({'message': 'Created', 'crop field': name, 'crop_field_id': crop_query.id}), 201
        else:
            response = jsonify({'message': 'Farm name {} already exists'.format(name)}), 201
    except exc.SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to store crop field {} with error:\n{}'.format(name, e)}), 400

    return response


def store_observation(file, datamap,
                      default_coordinate, field_dict,
                      equipment_id, default_time,
                      accessibility):
    if file.filename == '':
        return jsonify({'message': 'No file selected for uploading'}), 404

    elif not file or not allowed_file(file.filename):
        return jsonify({'message': 'Allowed file types are csv'}), 400

    filename = secure_filename(file.filename)
    filetype = get_file_ext(filename)

    # Extract and Load
    df, msg = extract_data(file, datamap, default_coordinate, default_time)

    if msg[-1] is False:
        return jsonify({'message': msg[0]}), 400

    response = load_data(df, datamap, field_dict, equipment_id, accessibility, filetype)

    del df
    return response


def extract_data(file, datamap, default_coordinate, default_time, filetype='csv'):
    if filetype == 'csv':
        dict_list, msg = extract_datamap(datamap)

        if msg[-1] is True:
            col_list = dict_list[0]
            datetime_dict = dict_list[1]
            coor_dict = dict_list[2]

            has_header = datamap.get("has_header", False)
            has_date = datamap.get("has_date", False)
            has_time = datamap.get("has_time", False)
            has_coordinate = datamap.get("has_coordinate", False)

            df = get_dataframe(file, has_header)

            # Keep columns that are only listed in the datamap
            df = df.loc[:, df.columns.isin(set(col_list))]

            # Parse datetime and coordinate columns in the dataframe
            df, msg = parse_datetime(df, datetime_dict, default_time, has_date, has_time)
            if msg[-1] is False:
                return None, msg

            df, msg = parse_coordinate(df, coor_dict, default_coordinate, has_coordinate)
            if msg[-1] is False:
                return None, msg

            return df, msg
    else:
        msg = ["Filetype {} not supported".format(filetype), False]

    return None, msg


def load_data(df, datamap, field, equipment_id, access_str, filetype='csv'):
    input_farm_id = field['farm_id']
    input_field_id = field['field_id']
    input_crop_id = field['crop_field_id']

    user_id = None
    owner_query = Owner.query.filter_by(owned_by_farm_id=input_farm_id).first()

    if owner_query is None:
        owner_query = Owner(input_farm_id, user_id)
        db.session.add(owner_query)
        db.session.commit()

    owner_id = owner_query.id

    access_response, is_ok = get_access_id(access_str)
    if not is_ok:
        return access_response, 400

    if filetype == 'csv':
        # Get data columns to store
        col_list = df.loc[:, ~df.columns.isin(['geo', 'date_time'])].columns

        dmap_list = datamap.get("maps")

        for dmap in dmap_list:
            observation_map = get_dict_value(dmap, 'observation')
            col_name = str(get_dict_value(dmap, 'column'))

            if col_name not in col_list:
                continue

            data_type = get_dict_value(observation_map, 'type')
            context = get_dict_value(observation_map, 'context')
            param = get_dict_value(observation_map, 'parameter')
            unit = get_dict_value(observation_map, 'unit')
            conditions = get_dict_value(observation_map, 'conditions')

            try:
                context_type = ObservedContextType(data_type)
            except ValueError:
                return jsonify({'message': 'Data type {} in datamap is not supported. '
                                           'Available data types: {}'.format(data_type,
                                                                             ObservedContextType.list())}), 400

            param_query, is_created = get_or_create(db.session, ParameterType, type=param)

            if is_created:
                db.session.commit()

            obs_context_query, is_created = get_or_create(db.session, ObservedContext,
                                                          context_type=context_type,
                                                          context=context,
                                                          parameter_id=param_query.id)

            if is_created:
                db.session.commit()

            unit_query, is_created = get_or_create(db.session, Unit,
                                                   type_id=param_query.id,
                                                   name=unit)
            if is_created:
                db.session.commit()

            obs_loc, is_created = get_or_create(db.session, ObservationLocation,
                                                farm_id=input_farm_id,
                                                field_id=input_field_id,
                                                crop_field_id=input_crop_id,
                                                access_id=access_response,
                                                owner_id=owner_id)
            if is_created:
                db.session.commit()

            obs_query, is_created = get_or_create(db.session, Observation,
                                                  observed_context_id=obs_context_query.id,
                                                  eq_id=equipment_id,
                                                  conditions=conditions,
                                                  location_id=obs_loc.id,
                                                  unit_id=unit_query.id)

            if is_created:
                db.session.commit()



            # Bulk insert but not checking any duplicate
            # (may cause UniqueViolation)
            df_data = df[["date_time", "geo", col_name]]
            df_data = df_data.rename(columns={col_name: "value"})
            df_data["observation_id"] = obs_query.id

            try:
                db.session.bulk_insert_mappings(SensingLog, df_data.to_dict(orient="records"))
                db.session.commit()
            except exc.SQLAlchemyError as e:
                db.session.rollback()

            del df_data

        return jsonify({'message': 'OK'}), 200
    else:
        return jsonify({'message': 'File cannot be loaded'}), 400


def parse_coordinate(df, coor_dict, coordinate, has_coordinate):
    # If there is no column for longitude and latitude,
    # use coordinate for all rows in the dataframe
    created_col_name = "geo"
    msg = ["OK", True]

    if coor_dict and has_coordinate:
        df[created_col_name] = df.apply(parse_coordinate_row, axis=1,
                                        coor_dict=coor_dict)

        col_list = [coor_dict["latitude"], coor_dict["longitude"]]

        df = df.drop(columns=col_list)
    else:
        try:
            long = float(coordinate['longitude'])
            lat = float(coordinate['latitude'])
        except ValueError:
            msg = ["Default longitude and latitude values should be float", False]
            return None, msg

        df[created_col_name] = 'POINT({} {})'.format(long, lat)

    return df, msg


def parse_coordinate_row(row, coor_dict):
    if "latitude" in coor_dict and "longitude" in coor_dict:
        lat_col = coor_dict["latitude"]
        lon_col = coor_dict["longitude"]

        return 'POINT({} {})'.format(row[lon_col],
                                     row[lat_col])

    return None


def parse_datetime_string(dtime_str):
    msg = ["OK", True]

    try:
        dtime = dtparse.parse(dtime_str)
        def_date = dtime.strftime("%Y-%m-%d")
        def_time = dtime.strftime("%H:%M:%S")
    except ValueError:
        msg = ["Error in parsing default datetime {}".format(dtime_str), False]

    return def_date, def_time, msg


def parse_datetime(df, datetime_dict, default_time, has_date, has_time):
    created_col_name = "date_time"
    msg = ["OK", True]

    if has_date or has_time:
        col_list = []

        # Find date and time columns to be dropped after new datetime column is created
        if "datetime" in datetime_dict:
            df[created_col_name] = df.apply(parse_datetime_row, axis=1,
                                            dtime_dict=datetime_dict,
                                            def_date=None,
                                            def_time=None)

            date_dict = datetime_dict["datetime"]
            date_col = date_dict['column']

            if date_col != created_col_name:
                col_list.append(date_col)

        elif "date" in datetime_dict or "time" in datetime_dict:
            if has_date ^ has_time:
                def_date, def_time, msg = parse_datetime_string(default_time)
                if msg[-1] is False:
                    return None, msg
            else:
                def_date = None
                def_time = None

            df[created_col_name] = df.apply(parse_datetime_row, axis=1,
                                            dtime_dict=datetime_dict,
                                            def_date=def_date,
                                            def_time=def_time)

            if "date" in datetime_dict:
                date_dict = datetime_dict["date"]
                date_col = date_dict['column']
                col_list.append(date_col)

            if "time" in datetime_dict:
                time_dict = datetime_dict["time"]
                time_col = time_dict['column']
                col_list.append(time_col)

        elif "year" in datetime_dict or "hour" in datetime_dict:
            if has_date ^ has_time:
                def_date, def_time, msg = parse_datetime_string(default_time)
                if msg[-1] is False:
                    return None, msg
            else:
                def_date = None
                def_time = None

            df[created_col_name] = df.apply(parse_datetime_row, axis=1,
                                            dtime_dict=datetime_dict,
                                            def_date=def_date,
                                            def_time=def_time)

            if "year" in datetime_dict:
                year_col = get_dict_value(datetime_dict, "year", subkey="column")
                month_col = get_dict_value(datetime_dict, "month", subkey="column")
                day_col = get_dict_value(datetime_dict, "day", subkey="column")

                col_list.append(year_col)
                col_list.append(month_col)
                col_list.append(day_col)

            if "hour" in datetime_dict:
                hour_col = get_dict_value(datetime_dict, "hour", subkey="column")
                minute_col = get_dict_value(datetime_dict, "minute", subkey="column")
                second_col = get_dict_value(datetime_dict, "second", subkey="column")

                col_list.append(hour_col)
                col_list.append(minute_col)
                col_list.append(second_col)

        else:
            msg = ["Error in parsing datetime contexts from datamap", False]
            return None, msg

        col_list = list(filter(None, col_list))
        df = df.drop(columns=col_list)

    else:
        # Use default date and time
        def_date, def_time, msg = parse_datetime_string(default_time)
        if msg[-1] is False:
            return None, msg

        df[created_col_name] = "{} {}".format(def_date, def_time)

    return df, msg


def get_dict_value(input_dict, key, subkey=None):
    val = None

    if input_dict is None:
        return None

    if key in input_dict:
        sub_dict = input_dict[key]
        if subkey:
            if subkey in sub_dict:
                val = sub_dict[subkey]
        else:
            val = sub_dict

    return val


def parse_datetime_row(row, dtime_dict, def_date, def_time):
    dayfirst = True

    if "datetime" in dtime_dict:
        datetime_col = get_dict_value(dtime_dict, "datetime", subkey="column")
        dtime_str = row[datetime_col]

    elif "date" in dtime_dict or "time" in dtime_dict:
        if "date" in dtime_dict:
            date_col = get_dict_value(dtime_dict, "date", subkey="column")
            date_param = get_dict_value(dtime_dict, "date", subkey="parameter")

            if date_param == "month-day-year":
                dayfirst = False

            date_str = row[date_col]
        else:
            date_str = def_date

        if "time" in dtime_dict:
            time_col = get_dict_value(dtime_dict, "time", subkey="column")
            time_str = row[time_col]
        else:
            time_str = def_time

        dtime_str = "{} {}".format(date_str, time_str)

    elif "year" in dtime_dict or "hour" in dtime_dict:
        if "year" in dtime_dict:
            year_col = get_dict_value(dtime_dict, "year", subkey="column")
            month_col = get_dict_value(dtime_dict, "month", subkey="column")
            day_col = get_dict_value(dtime_dict, "day", subkey="column")

            year_val = int(row[year_col])
            month_val = str(row[month_col]).split(".", 1)[0]
            day_val = int(row[day_col])

            date_str = "{}-{}-{}".format(year_val,
                                         month_val,
                                         day_val)
        else:
            date_str = def_date

        if "hour" in dtime_dict:
            hour_col = get_dict_value(dtime_dict, "hour", subkey="column")
            minute_col = get_dict_value(dtime_dict, "minute", subkey="column")
            second_col = get_dict_value(dtime_dict, "second", subkey="column")

            hour_val = row[hour_col] if hour_col else 0
            minute_val = row[minute_col] if minute_col else 0
            sec_val = row[second_col] if second_col else 0

            time_str = "{}:{}:{}".format(int(hour_val),
                                         int(minute_val),
                                         int(sec_val))
        else:
            time_str = def_time

        dtime_str = "{} {}".format(date_str, time_str)

    try:
        dtime = dtparse.parse(dtime_str, dayfirst=dayfirst)
    except ValueError:
        return None

    return dtime


def extract_datamap(datamap):
    col_names = []
    datetime_dict = {}
    loc_dict = {}

    has_header = datamap.get("has_header", False)
    has_date = datamap.get("has_date", False)
    has_time = datamap.get("has_time", False)
    has_coordinate = datamap.get("has_coordinate", False)

    msg = ["OK", True]
    map_list = datamap.get("maps")

    for dmap in map_list:
        col_name = dmap['column']
        if not has_header:
            try:
                if int(col_name) < 1:
                    msg = ['Datamap column should start from 1', False]
                    return None, msg
                col_name = str(col_name)
            except ValueError:
                msg = ['Column {} in datamap should be an integer'.format(col_name), False]
                return None, msg

        col_names.append(col_name)

        if has_date or has_time or has_coordinate:
            observation_map = dmap['observation']
            obs_type = observation_map['type']
            context = observation_map['context']

            if obs_type == 'datetime':
                param = observation_map['parameter']

                datetime_dict[context] = {"column": col_name,
                                          "parameter": param}
            elif obs_type == 'coordinate':
                loc_dict[context] = col_name

    return [col_names, datetime_dict, loc_dict], msg


def get_delimiter(csv_string):
    dialect = csv.Sniffer().sniff(str(csv_string))
    return dialect.delimiter


def get_dataframe(file, has_header):
    input_str = file.read()

    delimiter = get_delimiter(input_str)

    input_io = StringIO(input_str.decode('utf-8'))

    if has_header:
        df = pd.read_csv(input_io, sep=delimiter)
    else:
        df = pd.read_csv(input_io, header=None, sep=delimiter)
        # Make column names from index + 1 (Datamap column starts from 1)
        df.columns = list(map(lambda x: str(x + 1), df.columns))

    return df


def get_file_ext(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower()


def allowed_file(filename):
    allowed_ext = set(['csv'])
    return get_file_ext(filename) in allowed_ext


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


def get_sensing_log(params, status_list):
    context_type = params['context_type']

    farm_id = int(params['farm_id'])
    field_id = int(params['field_id'])

    crop_field_id = None
    if params.get('crop_field_id'):
        crop_field_id = params['crop_field_id']

    equipment_id = None
    if params.get('equipment_id'):
        equipment_id = int(params['equipment_id'])

    # Get allowed accessibility status IDs
    acc_status = db.session.query(AccessibilityStatus)\
        .filter(AccessibilityStatus.name.in_(status_list)).all()
    acc_status_list = [s.id for s in acc_status]

    # Query observation data
    query = db.session.query(ObservedContext, ParameterType, Observation, Unit, ObservationLocation) \
        .filter(ObservedContext.parameter_id == ParameterType.id,
                ObservedContext.id == Observation.observed_context_id,
                Observation.location_id == ObservationLocation.id,
                Observation.unit_id == Unit.id) \
        .filter(ObservationLocation.farm_id == farm_id,
                ObservationLocation.field_id == field_id) \
        .filter(ObservationLocation.access_id.in_(acc_status_list))

    if context_type:
        ctype_list = [ObservedContextType(ct) for ct in context_type]
        query = query.filter(ObservedContext.context_type.in_(ctype_list))

    if crop_field_id:
        query = query.filter(ObservationLocation.crop_field_id == crop_field_id)

    if equipment_id:
        query = query.filter(Observation.eq_id == equipment_id)

    sensing = init_observation(farm_id, field_id, crop_field_id)
    obs_context_type = None
    idx = 0
    total_df = None

    for ocontext, paramtype, observation, unit, oloc in query.all():
        if ocontext.context_type != obs_context_type:
            # if context is different, store previous df
            if obs_context_type is not None:
                sensing["observations"][-1]["log"] = set_sensing_log(total_df)
                total_df = None

            obs_context_type = ocontext.context_type

            access = AccessibilityStatus.query.get(oloc.access_id)
            obs_meta, idx = init_observation_meta()

            obs_dict = {
                "type": ocontext.context_type.value,
                "accessibility": access.name,
                "schema": obs_meta,
                "log": []
            }

            sensing["observations"].append(obs_dict)

        idx += 1
        obs_meta = {
            "column": idx,
            "object": ocontext.context,
            "parameter": paramtype.get_param(),
            "equipment_id": observation.eq_id,
            "observation_id": observation.id,
            "conditions": observation.conditions,
            "unit": unit.name
        }
        # obs_dict["meta"].append(obs_meta)
        sensing["observations"][-1]["schema"].append(obs_meta)

        # start = timer()

        df = pd.read_sql(db.session.query(SensingLog)
                         .filter(SensingLog.observation_id == observation.id).statement,
                         db.session.bind)

        # end = timer()
        # elapsed_time = end - start
        # print("elapsed_time pd.read_sql: {}".format(elapsed_time))

        if total_df is None:
            total_df = df
        else:
            total_df = pd.concat([total_df, df], ignore_index=True)

    if not sensing["observations"]:
        return jsonify({'message': 'No observation data found'}), 404
    else:
        if total_df is not None:
            sensing["observations"][-1]["log"] = set_sensing_log(total_df)

        json_str = json.dumps(sensing)
        response = jsonify(json_str), 200

    return response


def set_sensing_log(df):
    cvt = np.vectorize(convert_point_wkb)
    geo_series = cvt(df['geo'])

    df['longitude'] = geo_series[0]
    df['latitude'] = geo_series[1]

    df = df.drop(['geo'], axis=1)

    df = pd.pivot_table(df,
                        values='value',
                        index=['date_time', 'longitude', 'latitude'],
                        columns='observation_id').reset_index()

    return df.to_json(orient='values')


def to_geo_string(coordinates, geo_type="POLYGON"):
    val = None

    if coordinates is None:
        return None

    if geo_type == "POLYGON":
        # Prevent geometry non-closed rings error
        if coordinates[0] != coordinates[-1]:
            coordinates.append(coordinates[0])

        val = 'POLYGON(('

        for num, coor in enumerate(coordinates, start=1):
            point = "{} {}".format(coor['longitude'], coor['latitude'])

            if num > 1:
                val = "{},{}".format(val, point)
            else:
                val = "{}{}".format(val, point)

        val = val + "))"

    elif geo_type == "POINT":
        val = 'POINT({} {})'.format(coordinates['longitude'],
                                    coordinates['latitude'])

    # else:
    #     print("Format {} is not supported!".format(geo_type))

    return val


def convert_point_wkb(geo_point):
    if geo_point is None:
        return None

    point = wkb.loads(bytes(geo_point.data))
    return point.x, point.y


def convert_polygon_wkb(area):
    if area is None:
        return None

    polygon = wkb.loads(bytes(area.data))
    coor_list = []

    for coor in list(list(polygon.exterior.coords[:-1])):
        coor_dict = {
            'longitude': coor[0],
            'latitude': coor[-1]
        }
        coor_list.append(coor_dict)
    return coor_list


def get_observation_types():
    return [octype.value for octype in ObservedContextType]


def init_observation(fm_id, fl_id, cf_id):
    return {
        "farm_info": {
            "farm_id": fm_id,
            "field_id": fl_id,
            "crop_field_id": cf_id,
        },
        "observations": [],
    }


def init_observation_meta():
    meta = []

    for x in range(3):
        context_dict = {
            "column": x,
            "object": None,
            "parameter": None,
            "equipment_id": None,
            "observation_id": None,
            "conditions": None,
            "unit": None
        }

        if x == 0:
            context_dict["object"] = "datetime"
            context_dict["parameter"] = "YYYY-MM-DD hh:mm:ss"
        elif x == 1:
            context_dict["object"] = "longitude"
        else:
            context_dict["object"] = "latitude"

        meta.append(context_dict)

    return meta, x
