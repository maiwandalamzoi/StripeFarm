from datetime import datetime
import json
import numpy as np
import pandas as pd
import random
import requests
import string


def random_string(length=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))


def create_header(token=None, is_internal=False):
    header = {'content-type': "application/json"}

    if token:
        if is_internal:
            header['Authorization'] = "Internal " + str(token)
        else:
            header['Authorization'] = "Bearer " + str(token)

    return header


def admin_login(auth_url):
    email = "info@proeftuin.nl"
    password = "admin"

    login_payload = {
        "email": email,
        "password": password
    }
    headers = create_header()

    response = requests.post(auth_url + '/auth/jwt_token', json=login_payload, headers=headers)

    if response.status_code == 200:
        res_str = response.json()
        access_token = res_str['access_token']
        user_id = res_str['user_id']
        headers = create_header(access_token)

    return headers, user_id


def create_farm_payload(name, access):
    return {
        "name": "test_{}_farm".format(name),
        "address": random_string(),
        "postal_code": random_string(),
        "country_id": 1,
        "email": random_string(),
        "phone": random_string(),
        "webpage": random_string(),
        "accessibility": access
    }


def create_map(col_name,
               data_type,
               unit=None,
               condition=None,
               context_name=None):
    if data_type is "datetime":
        dtype = data_type
        context = data_type
        param = "YYYY-MM-DD hh:mm:ss"
    elif data_type is "date":
        dtype = "datetime"
        context = data_type
        param = "YYYY-MM-DD"
    elif data_type is "time":
        dtype = "datetime"
        context = data_type
        param = "hh:mm:ss"
    elif data_type is "latitude":
        dtype = "coordinate"
        context = data_type
        param = None
    elif data_type is "longitude":
        dtype = "coordinate"
        context = data_type
        param = None
    else:
        # Data
        dtype = "environment"

        if context_name:
            context = param = unit = str(context_name)
        else:
            context_list = ["soil", "weather"]
            param_list = ["temperature", "moisture"]

            context = random.choice(context_list)
            param = random.choice(param_list)
            if param is param_list[0]:
                unit = "C"
            else:
                unit = "%"

        condition = [{
            "parameter": "height",
            "value": random.randint(1, 101),
            "unit": "cm"
        }]

    map_data = {
        "column": col_name,
        "observation": {
            "type": dtype,
            "context": context,
            "parameter": param,
            "description": random_string(5),
            "unit": unit,
            "conditions": condition
        }
    }

    return map_data


def create_dummy_csv(has_header=True,
                     has_coordinate=True,
                     has_date=True,
                     has_time=True,
                     test_nr=0,
                     sample_data=10,
                     test_col=3):
    df = pd.DataFrame()
    map_list = []
    index = 1

    if has_date or has_time:
        now = datetime.now()

        if has_date and has_time:
            datetime_now = now.strftime("%Y-%m-%d %H:%M:%S")

            if has_header:
                col = "Datetime"
            else:
                col = str(index)
                index = index + 1

            df[col] = [datetime_now] * sample_data
            dmap = create_map(col, "datetime")
            map_list.append(dmap)

        else:
            if has_date:
                date_now = now.strftime("%Y-%m-%d")

                if has_header:
                    col = "Date"
                else:
                    col = str(index)
                    index = index + 1

                df[col] = [date_now] * sample_data
                dmap = create_map(col, "date")
                map_list.append(dmap)

            elif has_time:
                time_now = now.strftime("%H:%M:%S")
                if has_header:
                    col = "Time"
                else:
                    col = str(index)
                    index = index + 1

                df[col] = [time_now] * sample_data
                dmap = create_map(col, "time")
                map_list.append(dmap)

    if has_coordinate:
        if has_header:
            col_1 = "latitude"
            col_2 = "longitude"
        else:
            col_1 = str(index)
            index = index + 1

            col_2 = str(index)
            index = index + 1

        df[col_1] = np.random.uniform(low=0.5, high=13.3, size=(sample_data,))
        dmap = create_map(col_1, "latitude")
        map_list.append(dmap)

        df[col_2] = np.random.uniform(low=0.5, high=13.3, size=(sample_data,))
        dmap = create_map(col_2, "longitude")
        map_list.append(dmap)

    for i in range(test_col):
        if has_header:
            col = "test_{}".format(i)
        else:
            col = index
            index += 1

        df[col] = np.random.uniform(low=0.5, high=13.3, size=(sample_data,))
        dmap = create_map(col, "data")
        map_list.append(dmap)

    map_payload = {
        "name": random_string(),
        "description": random_string(),
        "has_header": has_header,
        "has_coordinate": has_coordinate,
        "has_date": has_date,
        "has_time": has_time,
        "model_id": None,
        "maps": map_list,
        "accessibility": "public",
    }

    file_name = 'test_data/datamap_test_{}.csv'.format(test_nr)
    df.to_csv(file_name, header=has_header, index=False)

    return file_name, map_payload


def store_datamap(map_url, farm_id, headers,
                  map_payload):
    params = {'farm_id': farm_id}

    response = requests.post(map_url + '/datamaps',
                             json=map_payload,
                             params=params,
                             headers=headers)

    map_id = None
    if response.status_code == 201:
        res_str = response.json()
        map_id = res_str["map_id"]
    else:
        response = requests.get(map_url + '/datamaps', headers=headers)
        if response.status_code is 200:
            res_str = response.json()
            datamaps = json.loads(res_str)

            datamap = None
            for dm in datamaps:
                if dm['name'] == map_payload['name']:
                    datamap = dm
                    break

            if datamap:
                map_id = datamap.get("id")

    return map_id
