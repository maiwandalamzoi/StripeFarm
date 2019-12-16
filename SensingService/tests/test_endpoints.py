import unittest
import json
import requests
import dateutil.parser as dtparse
# import string
# import random
from requests_toolbelt.multipart.encoder import MultipartEncoder
from datetime import datetime
# import pandas as pd
# import numpy as np
from .test_utils import *

sens_url = 'http://127.0.0.1:5002/api'
auth_url = 'http://127.0.0.1:5003/api'
map_url = 'http://127.0.0.1:5001/api'


# prod_url = 'http://proeftuin.win.tue.nl/api/v1'
# sens_url = prod_url
# auth_url = prod_url
# map_url = prod_url


# def random_string(length=10):
#     """Generate a random string of fixed length """
#     letters = string.ascii_lowercase
#     return ''.join(random.choice(letters) for i in range(length))
#
#
# def create_header(token=None, is_internal=False):
#     header = {'content-type': "application/json"}
#
#     if token:
#         if is_internal:
#             header['Authorization'] = "Internal " + str(token)
#         else:
#             header['Authorization'] = "Bearer " + str(token)
#
#     return header
#
#
# def admin_login():
#     email = "info@proeftuin.nl"
#     password = "admin"
#
#     login_payload = {
#         "email": email,
#         "password": password
#     }
#     headers = create_header()
#
#     response = requests.post(auth_url + '/auth/jwt_token', json=login_payload, headers=headers)
#
#     if response.status_code == 200:
#         res_str = response.json()
#         access_token = res_str['access_token']
#         user_id = res_str['user_id']
#         headers = create_header(access_token)
#
#     return headers, user_id
#
#
# def create_farm_payload(name, access):
#     return {
#         "name": "test_{}_farm".format(name),
#         "address": "{} street".format(name),
#         "postal_code": "12345AA",
#         "country_id": 1,
#         "email": "farm_{}@testfarm.com".format(name),
#         "phone": "1234567890",
#         "webpage": "farm_{}.com".format(name),
#         "accessibility": access
#     }
#
#
# def create_map(col_name,
#                data_type,
#                unit=None,
#                condition=None):
#     if data_type is "datetime":
#         dtype = data_type
#         context = data_type
#         param = "YYYY-MM-DD hh:mm:ss"
#     elif data_type is "date":
#         dtype = "datetime"
#         context = data_type
#         param = "YYYY-MM-DD"
#     elif data_type is "time":
#         dtype = "datetime"
#         context = data_type
#         param = "hh:mm:ss"
#     elif data_type is "latitude":
#         dtype = "coordinate"
#         context = data_type
#         param = None
#     elif data_type is "longitude":
#         dtype = "coordinate"
#         context = data_type
#         param = None
#     else:
#         # Data
#         dtype = "environment"
#         context_list = ["soil", "weather"]
#         param_list = ["temperature", "moisture"]
#
#         context = random.choice(context_list)
#         param = random.choice(param_list)
#         if param is param_list[0]:
#             unit = "C"
#         else:
#             unit = "%"
#         condition = [{
#             "parameter": "height",
#             "value": random.randint(1, 101),
#             "unit": "cm"
#         }]
#
#     map_data = {
#         "column": col_name,
#         "observation": {
#             "type": dtype,
#             "context": context,
#             "parameter": param,
#             "description": random_string(5),
#             "unit": unit,
#             "conditions": condition
#         }
#     }
#
#     return map_data
#
#
# def create_dummy_csv(has_header=True,
#                      has_coordinate=True,
#                      has_date=True,
#                      has_time=True,
#                      sample_data=10,
#                      test_col=3):
#     df = pd.DataFrame()
#     map_list = []
#     index = 1
#
#     if has_date or has_time:
#         now = datetime.now()
#
#         if has_date and has_time:
#             datetime_now = now.strftime("%Y-%m-%d %H:%M:%S")
#
#             if has_header:
#                 col = "Datetime"
#             else:
#                 col = str(index)
#                 index = index + 1
#
#             df[col] = [datetime_now] * sample_data
#             dmap = create_map(col, "datetime")
#             map_list.append(dmap)
#
#         else:
#             if has_date:
#                 date_now = now.strftime("%Y-%m-%d")
#
#                 if has_header:
#                     col = "Date"
#                 else:
#                     col = str(index)
#                     index = index + 1
#
#                 df[col] = [date_now] * sample_data
#                 dmap = create_map(col, "date")
#                 map_list.append(dmap)
#
#             elif has_time:
#                 time_now = now.strftime("%H:%M:%S")
#                 if has_header:
#                     col = "Time"
#                 else:
#                     col = str(index)
#                     index = index + 1
#
#                 df[col] = [time_now] * sample_data
#                 dmap = create_map(col, "time")
#                 map_list.append(dmap)
#
#     if has_coordinate:
#         if has_header:
#             col_1 = "latitude"
#             col_2 = "longitude"
#         else:
#             col_1 = str(index)
#             index = index + 1
#
#             col_2 = str(index)
#             index = index + 1
#
#         df[col_1] = np.random.uniform(low=0.5, high=13.3, size=(sample_data,))
#         dmap = create_map(col_1, "latitude")
#         map_list.append(dmap)
#
#         df[col_2] = np.random.uniform(low=0.5, high=13.3, size=(sample_data,))
#         dmap = create_map(col_2, "longitude")
#         map_list.append(dmap)
#
#     # Will use three test columns
#     for i in range(test_col):
#         if has_header:
#             col = "test_{}".format(i)
#         else:
#             col = index
#             index += 1
#
#         df[col] = np.random.uniform(low=0.5, high=13.3, size=(sample_data,))
#         dmap = create_map(col, "data")
#         map_list.append(dmap)
#
#     map_payload = {
#         "name": random_string(),
#         "description": random_string(),
#         "has_header": has_header,
#         "has_coordinate": has_coordinate,
#         "has_date": has_date,
#         "has_time": has_time,
#         "model_id": None,
#         "maps": map_list,
#         "accessibility": "public",
#     }
#
#     file_name = 'datamap_test.csv'
#     df.to_csv('datamap_test.csv', header=has_header, index=False)
#
#     return file_name, map_payload
#
#
# def store_datamap(farm_id, headers,
#                   map_payload):
#     # payload = {
#     #     "name": "Test datamap",
#     #     "description": "This is only for testing purposes",
#     #     "has_header": has_header,
#     #     "has_coordinate": has_coordinate,
#     #     "has_date": has_date,
#     #     "has_time": has_time,
#     #     "model_id": None,
#     #     "maps": [],
#     #     "accessibility": "public",
#     # }
#     #
#     # map_data = []
#     # index = 1
#     #
#     # if has_date and has_time:
#     #     if has_header:
#     #         col = "Date and time"
#     #     else:
#     #         col = index
#     #         index += 1
#     #
#     #     date_time_col = {
#     #         "column": col,
#     #         "observation": {
#     #             "type": "datetime",
#     #             "context": "datetime",
#     #             "parameter": "YYYY-MM-DD hh:mm",
#     #             "description": "Date and time to get data",
#     #             "unit": None,
#     #             "condition": None
#     #         }
#     #     }
#     #
#     #     map_data.append(date_time_col)
#     #
#     # map_data = [
#     #     {
#     #         "column":"Temperature 1.50m",
#     #         "observation":{
#     #             "type":"environment",
#     #             "context":"weather",
#     #             "parameter":"temperature",
#     #             "description":"Weather temperature 1.5m above ground",
#     #             "unit":"Celsius",
#     #             "conditions":[
#     #                 {
#     #                     "parameter":"height",
#     #                     "value":1.5,
#     #                     "unit":"m"
#     #                 }
#     #             ]
#     #         }
#     #     },
#     #     {
#     #         "column":"Moisture -10cm",
#     #         "observation":{
#     #             "type":"environment",
#     #             "context":"soil",
#     #             "parameter":"moisture",
#     #             "description":"Soil moisture 10cm under ground",
#     #             "unit":"%",
#     #             "conditions":[
#     #                 {
#     #                     "parameter":"height",
#     #                     "value":-10,
#     #                     "unit":"cm"
#     #                 }
#     #             ]
#     #         }
#     #     },
#     #     {
#     #         "column":"Moisture -20cm",
#     #         "observation":{
#     #             "type":"environment",
#     #             "context":"soil",
#     #             "parameter":"moisture",
#     #             "description":"Soil moisture 20cm under ground",
#     #             "unit":"%",
#     #             "conditions":[
#     #                 {
#     #                     "parameter":"height",
#     #                     "value":-20,
#     #                     "unit":"cm"
#     #                 }
#     #             ]
#     #         }
#     #     },
#     #     {
#     #         "column":"Moisture -30cm",
#     #         "observation":{
#     #             "type":"environment",
#     #             "context":"soil",
#     #             "parameter":"moisture",
#     #             "description":"Soil moisture 30cm under ground",
#     #             "unit":"%",
#     #             "conditions":[
#     #                 {
#     #                     "parameter":"height",
#     #                     "value":-30,
#     #                     "unit":"cm"
#     #                 }
#     #             ]
#     #         }
#     #     }
#     # ]
#
#     # df, map_data = create_dummy_csv(has_header=has_header,
#     #                                 has_coordinate=has_coordinate,
#     #                                 has_date=has_date,
#     #                                 has_time=has_time)
#
#     # payload['maps'].append(map_data)
#     params = {'farm_id': farm_id}
#
#     response = requests.post(map_url + '/datamaps',
#                              json=map_payload,
#                              params=params,
#                              headers=headers)
#
#     map_id = None
#     if response.status_code == 201:
#         res_str = response.json()
#         map_id = res_str["map_id"]
#
#     return map_id


class TestEndpoints(unittest.TestCase):
    admin_header = None
    admin_id = None

    user_infos = []
    farm_infos = []

    def setUp(self):
        self.farm_infos = []
        access_list = ["public", "private", "private"]

        self.admin_header, self.admin_id = admin_login(auth_url)

        for num, access in enumerate(access_list):
            farm_info = {
                "farm_id": None,
                "payload": create_farm_payload(num, access)
            }

            response = requests.post(sens_url + '/farms', json=farm_info["payload"], headers=self.admin_header)
            self.assertEqual(response.status_code, 201)
            res_str = response.json()
            farm_info["farm_id"] = res_str.get("farm_id")
            self.farm_infos.append(farm_info)

        # create farmer and user
        roles = ["admin", "farmer", "user"]
        self.user_infos = []
        for role in roles:
            user_info = {
                "role": role,
                "user_id": None,
                "payload": None,
                "headers": None
            }

            if role is "admin":
                user_info["headers"] = self.admin_header
                user_info["user_id"] = self.admin_id
                self.user_infos.append(user_info)
            else:
                user_info["payload"] = {
                    "first_name": "{}_first".format(role),
                    "last_name": "{}_last".format(role),
                    "email": "{}@email.com".format(role),
                    "password": "123456"
                }

                response = requests.post(auth_url + '/users/register', json=user_info["payload"])
                res_str = response.json()
                access_token = res_str['access_token']
                user_info["user_id"] = res_str['user_id']
                user_info["headers"] = create_header(access_token)
                self.user_infos.append(user_info)

                if role != "user":
                    role_payload = {
                        "role": role,
                        "user_id": user_info["user_id"],
                        "fields": []
                    }

                    # User does not have a role in the last farm
                    for num, farm in enumerate(self.farm_infos):
                        if farm != self.farm_infos[-1]:
                            response = requests.post(auth_url + '/farm_users/{}'.format(farm["farm_id"]),
                                                     json=role_payload,
                                                     headers=self.admin_header)

    def tearDown(self):
        # Remove all farms
        for farm_info in self.farm_infos:
            response = requests.delete('{}/farms/{}'.format(sens_url, farm_info["farm_id"]),
                                       headers=self.admin_header)

        # Remove users
        for user_info in self.user_infos:
            if user_info["role"] is not "admin":
                response = requests.delete(auth_url + '/users/{}'.format(user_info["user_id"]),
                                           headers=user_info["headers"])

    def test_farms(self):
        """
        Testing farm endpoints
        """
        for user in self.user_infos:
            role = user["role"]

            response = requests.get(sens_url + '/farms', headers=user["headers"])
            self.assertEqual(response.status_code, 200)
            res_str = response.json()
            farm_list = json.loads(res_str)

            if role is "admin":
                self.assertEqual(len(farm_list), 3)
            elif role is "farmer":
                self.assertEqual(len(farm_list), 2)
            else:
                self.assertEqual(len(farm_list), 1)

    def test_farm_by_id(self):
        """
        Testing farm by id endpoints
        """
        for user in self.user_infos:
            role = user["role"]
            headers = user["headers"]

            for i, farm_info in enumerate(self.farm_infos):
                farm_id = farm_info["farm_id"]
                farm_access = farm_info["payload"]["accessibility"]

                response = requests.get('{}/farms/{}'.format(sens_url, farm_id), headers=headers)

                if (role == "user" and farm_access != "public") or \
                        (role != "admin" and farm_info == self.farm_infos[-1]):
                    self.assertNotEqual(response.status_code, 200)
                else:
                    self.assertEqual(response.status_code, 200)
                    # print("{} read farm info {}".format(role, i))
                    res_str = response.json()
                    farm = json.loads(res_str)
                    # farm = response.json()

                    self.assertEqual(farm["name"], farm_info["payload"]["name"])
                    self.assertEqual(farm["address"], farm_info["payload"]["address"])
                    self.assertEqual(farm["postal_code"], farm_info["payload"]["postal_code"])
                    self.assertEqual(farm["email"], farm_info["payload"]["email"])
                    self.assertEqual(farm["phone"], farm_info["payload"]["phone"])
                    self.assertEqual(farm["webpage"], farm_info["payload"]["webpage"])

                    country = farm["country"]
                    if country:
                        self.assertEqual(country["id"], farm_info["payload"]["country_id"])

                payload = {
                    "name": farm_info["payload"]["name"],
                    "address": random_string(),
                    "postal_code": random_string(),
                    "email": random_string()
                }

                # Update data
                response = requests.put('{}/farms/{}'.format(sens_url, farm_id), json=payload, headers=headers)
                if not (role == "admin" or role == "farm_admin"):
                    self.assertNotEqual(response.status_code, 201)
                else:
                    self.assertEqual(response.status_code, 201)
                    # print("{} update farm info {}: address {} postal {} email {}".format(role, i,
                    #                                                                      payload["address"],
                    #                                                                      payload["postal_code"],
                    #                                                                      payload["email"]))

                    farm_info["payload"]["address"] = payload["address"]
                    farm_info["payload"]["postal_code"] = payload["postal_code"]
                    farm_info["payload"]["email"] = payload["email"]
                    self.farm_infos[i]["payload"] = farm_info["payload"]

                    response = requests.get('{}/farms/{}'.format(sens_url, farm_id), headers=headers)
                    self.assertEqual(response.status_code, 200)

                    # farm = response.json()
                    res_str = response.json()
                    farm = json.loads(res_str)

                    self.assertEqual(farm["name"], farm_info["payload"]["name"])
                    self.assertEqual(farm["address"], farm_info["payload"]["address"])
                    self.assertEqual(farm["postal_code"], farm_info["payload"]["postal_code"])
                    self.assertEqual(farm["email"], farm_info["payload"]["email"])

        # Delete farm
        response = requests.delete('{}/farms/{}'.format(sens_url, farm_id), headers=self.admin_header)
        self.assertEqual(response.status_code, 204)

        # The farm really does not exists
        response = requests.delete('{}/farms/{}'.format(sens_url, farm_id), headers=self.admin_header)
        self.assertEqual(response.status_code, 404)

        # Get unavailable farm by id
        farm_id += 10
        response = requests.get('{}/farms/{}'.format(sens_url, farm_id), headers=self.admin_header)
        self.assertEqual(response.status_code, 404)

    def test_get_farm_fields(self):
        """
        Testing farm field endpoints
        """

        def compare_field(this, input_field, data):
            this.assertEqual(input_field['field_name'], data['field_name'])
            this.assertEqual(input_field['size_in_hectare'], data['size_in_hectare'])
            this.assertEqual(input_field['coordinates'], data['coordinates'])

            soil_type = input_field['soil_type']
            if soil_type:
                this.assertEqual(soil_type['id'], data['soil_type_id'])
            else:
                this.assertIsNone(input_field['soil_type'])

        farm_info = self.farm_infos[0]
        farm_id = farm_info["farm_id"]
        response = requests.get('{}/farms/{}'.format(sens_url, farm_id), headers=self.admin_header)
        self.assertEqual(response.status_code, 200)

        res_str = response.json()
        found_farm = json.loads(res_str)
        self.assertEqual(farm_info["payload"]["name"], found_farm['name'])

        field_name = "North field"
        field_size = 2.5
        soil_id = 1

        payload = {
            'field_name': field_name,
            'coordinates': [],
            'size_in_hectare': field_size,
            'soil_type_id': soil_id,
            'accessibility': "public"
        }

        for x in range(4):
            coor_dict = {
                "latitude": x,
                "longitude": 2 * x
            }
            payload['coordinates'].append(coor_dict)

        response = requests.post('{}/farms/{}/fields'.format(sens_url, farm_id),
                                 json=payload,
                                 headers=self.admin_header)
        self.assertEqual(response.status_code, 201)
        res_str = response.json()
        field_id = res_str["field_id"]

        response = requests.get('{}/farms/{}/fields/{}'.format(sens_url, farm_id, field_id), headers=self.admin_header)
        self.assertEqual(response.status_code, 200)
        res_str = response.json()
        field = json.loads(res_str)
        # field = response.json()

        compare_field(self, field, payload)

        # Update without coordinate
        payload = {
            'field_name': field_name,
            'coordinates': None,
            'size_in_hectare': None,
            'soil_type_id': None,
            'accessibility': "public"
        }

        response = requests.put('{}/farms/{}/fields/{}'.format(sens_url, farm_id, field_id),
                                json=payload,
                                headers=self.admin_header)
        self.assertEqual(response.status_code, 201)

        response = requests.get('{}/farms/{}/fields/{}'.format(sens_url, farm_id, field_id),
                                headers=self.admin_header)
        self.assertEqual(response.status_code, 200)

        res_str = response.json()
        field = json.loads(res_str)
        # field = response.json()
        compare_field(self, field, payload)

        response = requests.delete('{}/farms/{}/fields/{}'.format(sens_url, farm_id, field_id),
                                   headers=self.admin_header)
        self.assertEqual(response.status_code, 204)

        response = requests.delete('{}/farms/{}/fields/{}'.format(sens_url, farm_id, field_id),
                                   headers=self.admin_header)
        self.assertEqual(response.status_code, 404)

    def test_get_crop_fields(self):
        """
        Testing crop field endpoints
        """

        def compare_date(this, date_str1, date_str2):
            if date_str1 is not None and date_str2 is not None:
                date1 = dtparse.parse(date_str1)
                date2 = dtparse.parse(date_str2)

                this.assertEqual(date1.date(), date2.date())
            else:
                this.assertEqual(date_str1, date_str2)

        def compare_crop_field(this, input_file, data):
            this.assertEqual(input_file['name'], data['name'])

            compare_date(this, input_file['period_start'], data['period_start'])
            compare_date(this, input_file['period_end'], data['period_end'])
            this.assertEqual(input_file['coordinates'], data['coordinates'])

            if data['crop_type_id']:
                ctype = input_file['crop_type']
                this.assertEqual(ctype['id'], data['crop_type_id'])
            else:
                this.assertIsNone(input_file['crop_type'])

        farm_info = self.farm_infos[0]
        farm_id = farm_info["farm_id"]
        response = requests.get('{}/farms/{}'.format(sens_url, farm_id), headers=self.admin_header)
        self.assertEqual(response.status_code, 200)

        res_str = response.json()
        found_farm = json.loads(res_str)

        self.assertEqual(farm_info["payload"]["name"], found_farm["name"])

        field_name = "North field"
        field_size = 2.5
        soil_id = 1

        payload = {
            'field_name': field_name,
            'coordinates': [],
            'size_in_hectare': field_size,
            'soil_type_id': soil_id,
            'accessibility': "public"
        }

        for x in range(4):
            coor_dict = {
                "latitude": x,
                "longitude": 2 * x
            }
            payload['coordinates'].append(coor_dict)

        response = requests.post('{}/farms/{}/fields'.format(sens_url, farm_id),
                                 json=payload, headers=self.admin_header)
        self.assertEqual(response.status_code, 201)
        res_str = response.json()
        post_field_id = res_str["field_id"]

        response = requests.get('{}/farms/{}/fields'.format(sens_url, farm_id), headers=self.admin_header)
        self.assertEqual(response.status_code, 200)

        res_str = response.json()
        field_list = json.loads(res_str)

        is_found = False
        field_id = None

        for f in field_list:
            if f["field_name"] == field_name:
                is_found = True
                field_id = f['id']
                break

        self.assertTrue(is_found)
        self.assertIsNotNone(field_id)
        self.assertEqual(post_field_id, field_id)

        # Add crop type
        ctype_payload = {
            'name': "Potato",
            'variety': "Fontane"
        }

        response = requests.post('{}/crop_types'.format(sens_url), json=ctype_payload, headers=self.admin_header)
        self.assertEqual(response.status_code, 201)

        response = requests.get('{}/crop_types'.format(sens_url), headers=self.admin_header)
        self.assertEqual(response.status_code, 200)

        res_str = response.json()
        crop_types = json.loads(res_str)
        crop_type = None

        for ct in crop_types:
            if ct['name'] == ctype_payload['name']:
                crop_type = ct
                break

        self.assertIsNotNone(crop_type)
        self.assertEqual(crop_type['name'], ctype_payload['name'])
        self.assertEqual(crop_type['variety'], ctype_payload['variety'])

        cf_payload = {
            'name': "Potato crop 2019",
            'crop_type_id': crop_type['id'],
            'period_start': "2019-01-22",
            'period_end': "Jun-09-2019",
            'coordinates': payload['coordinates'],
            'accessibility': "public"
        }

        response = requests.post(
            '{}/farms/{}/fields/{}/crop_fields'.format(sens_url, farm_id, field_id),
            json=cf_payload, headers=self.admin_header)
        self.assertEqual(response.status_code, 201)

        response = requests.get(
            '{}/farms/{}/fields/{}/crop_fields'.format(sens_url, farm_id, field_id), headers=self.admin_header)
        self.assertEqual(response.status_code, 200)

        res_str = response.json()
        crop_fields = json.loads(res_str)

        crop_field = None

        for cf in crop_fields:
            if cf['name'] == cf_payload['name']:
                crop_field = cf
                break

        self.assertIsNotNone(crop_field)
        compare_crop_field(self, crop_field, cf_payload)

        crop_field_id = crop_field['id']
        response = requests.get(
            '{}/farms/{}/fields/{}/crop_fields/{}'.format(sens_url, farm_id, field_id, crop_field_id),
            headers=self.admin_header)
        self.assertEqual(response.status_code, 200)

        res_str = response.json()
        crop_field = json.loads(res_str)
        compare_crop_field(self, crop_field, cf_payload)

        cf_payload = {
            'name': "Potato crop",
            'crop_type_id': crop_type['id'],
            'period_start': None,
            'period_end': None,
            'coordinates': payload['coordinates'],
            'accessibility': "public"
        }

        response = requests.put(
            '{}/farms/{}/fields/{}/crop_fields/{}'.format(sens_url, farm_id, field_id, crop_field_id),
            json=cf_payload,
            headers=self.admin_header)
        self.assertEqual(response.status_code, 201)

        response = requests.get(
            '{}/farms/{}/fields/{}/crop_fields/{}'.format(sens_url, farm_id, field_id, crop_field_id),
            headers=self.admin_header)
        self.assertEqual(response.status_code, 200)

        res_str = response.json()
        crop_field = json.loads(res_str)
        compare_crop_field(self, crop_field, cf_payload)

        response = requests.delete(
            '{}/farms/{}/fields/{}/crop_fields/{}'.format(sens_url, farm_id, field_id, crop_field_id),
            headers=self.admin_header)
        self.assertEqual(response.status_code, 204)

        response = requests.delete(
            '{}/farms/{}/fields/{}/crop_fields/{}'.format(sens_url, farm_id, field_id, crop_field_id),
            headers=self.admin_header)
        self.assertEqual(response.status_code, 404)

    def test_equipment(self):
        def compare_equipment(this, input, data):
            this.assertEqual(input["name"], data["name"])
            this.assertEqual(input["description"], data["description"])
            this.assertEqual(input["model_id"], data["model_id"])
            this.assertEqual(input["manufacturing_date"], data["manufacturing_date"])
            this.assertEqual(input["serial_number"], data["serial_number"])
            this.assertEqual(input["accessibility"], data["accessibility"])

        farm_info = self.farm_infos[0]
        farm_id = farm_info["farm_id"]

        now = datetime.now()
        dt_string = now.strftime("%Y-%m-%d")

        eq_payload = {
            "name": random_string(),
            "description": random_string(20),
            "model_id": 1,
            "manufacturing_date": dt_string,
            "serial_number": random_string(),
            "accessibility": "public"
        }

        params = {"farm_id": farm_id}

        response = requests.post('{}/equipments'.format(sens_url),
                                 json=eq_payload,
                                 params=params,
                                 headers=self.admin_header)
        self.assertEqual(response.status_code, 201)

        res_str = response.json()
        eq_id = res_str.get("equipment_id")

        response = requests.get('{}/equipments'.format(sens_url),
                                params=params,
                                headers=self.admin_header)
        self.assertEqual(response.status_code, 200)

        response = requests.get('{}/equipments/{}'.format(sens_url, eq_id),
                                params=params,
                                headers=self.admin_header)
        self.assertEqual(response.status_code, 200)

        res_str = response.json()
        eq = json.loads(res_str)
        compare_equipment(self, eq, eq_payload)

        eq_payload["name"] = random_string()
        eq_payload["description"] = random_string(15)
        eq_payload["serial_number"] = random_string()
        eq_payload["accessibility"] = "private"

        response = requests.put('{}/equipments/{}'.format(sens_url, eq_id),
                                params=params,
                                json=eq_payload,
                                headers=self.admin_header)
        self.assertEqual(response.status_code, 201)

        response = requests.get('{}/equipments/{}'.format(sens_url, eq_id),
                                params=params,
                                headers=self.admin_header)
        self.assertEqual(response.status_code, 200)

        res_str = response.json()
        eq = json.loads(res_str)

        compare_equipment(self, eq, eq_payload)

        response = requests.delete('{}/equipments/{}'.format(sens_url, eq_id),
                                   params=params,
                                   headers=self.admin_header)
        self.assertEqual(response.status_code, 204)

    def test_upload_observation_file(self):
        # Get file
        # filename = "apps4agri_small.csv"
        # filepath = "D:/Projects/AgroTechFood/Doc/Data/" + filename

        # f = open(filepath, 'rb')
        # file = f.read()
        # print(f.read())

        # Get farm ID
        farm_info = self.farm_infos[0]
        farm_id = farm_info["farm_id"]

        # Get field ID
        field_payload = {
            'field_name': "Test field name",
            'coordinates': [],
            'size_in_hectare': 2.5,
            'soil_type_id': 1,
            'accessibility': "public"
        }

        for x in range(4):
            coor_dict = {
                "latitude": x,
                "longitude": 2 * x
            }
            field_payload['coordinates'].append(coor_dict)

        response = requests.post('{}/farms/{}/fields'.format(sens_url, farm_id),
                                 json=field_payload, headers=self.admin_header)
        self.assertEqual(response.status_code, 201)
        res_str = response.json()
        field_id = res_str["field_id"]

        # Get crop field ID
        cf_payload = {
            'name': "Potato crop 2019",
            'crop_type_id': 1,
            'period_start': "2019-01-22",
            'period_end': "Jun-09-2019",
            'coordinates': field_payload['coordinates'],
            'accessibility': "public"
        }

        response = requests.post(
            '{}/farms/{}/fields/{}/crop_fields'.format(sens_url, farm_id, field_id),
            json=cf_payload, headers=self.admin_header)
        self.assertEqual(response.status_code, 201)
        res_str = response.json()
        crop_field_id = res_str["crop_field_id"]

        # Get equipment ID
        now = datetime.now()
        dt_string = now.strftime("%Y-%m-%d")

        eq_payload = {
            "name": random_string(),
            "description": random_string(20),
            "model_id": 1,
            "manufacturing_date": dt_string,
            "serial_number": random_string(),
            "accessibility": "public"
        }

        params = {"farm_id": farm_id}
        response = requests.post('{}/equipments'.format(sens_url),
                                 json=eq_payload,
                                 params=params,
                                 headers=self.admin_header)
        self.assertEqual(response.status_code, 201)

        res_str = response.json()
        eq_id = res_str.get("equipment_id")

        csv_name, map_payload = create_dummy_csv(has_header=True,
                                                 has_coordinate=False,
                                                 has_date=False,
                                                 has_time=False,
                                                 sample_data=10,
                                                 test_col=3)



        # Get map ID
        map_id = store_datamap(map_url, farm_id, self.admin_header, map_payload)

        # Get map ID
        # map_id = create_datamap(farm_id, self.admin_header)
        self.assertIsNotNone(map_id)

        f = open(csv_name, 'rb')
        mp_encoder = MultipartEncoder(
            fields={
                'farm_id': str(farm_id),
                'field_id': str(field_id),
                'crop_field_id': str(crop_field_id),
                'equipment_id': str(eq_id),
                'map_id': str(map_id),
                'accessibility': "private",

                # plain file object, no filename or mime type produces a
                # Content-Disposition header with just the part name
                'file': (csv_name, f.read(), 'text/plain'),
            }
        )

        dt_string = now.strftime("%Y-%m-%d %H:%M:%S")

        params = {
            'latitude': 10.12345,
            'longitude': 15.12345,
            'datetime': dt_string
        }

        # Add content-type in the header
        headers = self.admin_header
        headers['Content-Type'] = mp_encoder.content_type

        # Send streaming data
        response = requests.post(
            "{}/observations/upload".format(sens_url),
            params=params,
            data=mp_encoder,  # The MultipartEncoder is posted as data, don't use files=...!
            # The MultipartEncoder provides the content-type header with the boundary:
            headers=headers
        )
        f.close()
        res_str = response.json()
        print("Response upload data: {}".format(res_str))

        # Read observation data
        params = {
            "type": "environment",
            "farm_id": farm_id,
            "field_id": field_id,
            "crop_field_id": crop_field_id,
            "equipment_id": None
        }
        response = requests.get('{}/observations'.format(sens_url),
                                params=params,
                                headers=self.admin_header)
        res_str = response.json()
        print("Response get data: {}".format(res_str))

        # Read by general user
        payload = {
            "first_name": random_string(),
            "last_name": random_string(),
            "email": "{}@email.com".format(random_string()),
            "password": random_string()
        }

        response = requests.post(auth_url + '/users/register', json=payload)
        self.assertEqual(response.status_code, 201)

        res_str = response.json()
        access_token = res_str['access_token']
        user_id = res_str['user_id']
        user_headers = create_header(access_token)

        response = requests.get('{}/observations'.format(sens_url),
                                params=params,
                                headers=user_headers)
        res_str = response.json()
        print("Response get data: {}".format(res_str))

        # Delete general user
        response = requests.delete('{}/users/{}'.format(auth_url, user_id), headers=user_headers)
        self.assertEqual(response.status_code, 204)

        # Delete observation data
        params = {
            "type": "environment",
            "farm_id": farm_id,
            "field_id": field_id,
            "crop_field_id": crop_field_id
        }
        response = requests.delete('{}/observations'.format(sens_url),
                                   params=params,
                                   headers=self.admin_header)
        self.assertEqual(response.status_code, 204)

        # Delete equipment
        response = requests.delete('{}/equipments/{}'.format(sens_url, eq_id),
                                   params=params,
                                   headers=self.admin_header)
        self.assertEqual(response.status_code, 204)

        # Delete datamap
        response = requests.delete('{}/datamaps/{}'.format(map_url, map_id),
                                   headers=self.admin_header)
        self.assertEqual(response.status_code, 204)

    # def test_get_observation(self):
    #     # Get farm ID
    #     # farm_info = self.farm_infos[0]
    #     # farm_id = farm_info["farm_id"]
    #     farm_id = 12
    #     field_id = 12
    #     crop_field_id = 39
    #
    #     params = {
    #         "type": "environment",
    #         "farm_id": farm_id,
    #         "field_id": field_id,
    #         "crop_field_id": crop_field_id,
    #         "equipment_id": None
    #     }
    #
    #     self.admin_header, self.admin_id = admin_login()
    #
    #     response = requests.get(
    #         '{}/observations'.format(sens_url),
    #         params=params,
    #         headers=self.admin_header)
    #     self.assertEqual(response.status_code, 200)
    #
    #     res_str = response.json()
    #     print(res_str)

    # def test_observation(self):
    #     params = {
    #         'context_type': ["environment", "crop", "harvest"],
    #         'context': "soil",
    #         'context_parameter': "moisture",
    #         'farm_id': 1,
    #         'field_id': 2,
    #         'crop_id': 3,
    #         'equipment_model_id': 4,
    #         'equipment_id': 5,
    #         'longitude': 1.2345,
    #         'latitude': 6.789,
    #         'date': "2017-09-17",
    #         'time': "10:00",
    #         }
    #
    #     response = requests.get(
    #         '{}/observations/search'.format(sens_url),
    #         params=params
    #     )
    #
    #     # res_str = response.json()
    #     print("Result: {}".format(response))
    #     self.assertEqual(response.status_code, 200)
    #
    # def test_observation_context(self):
    #     payload = {
    #         'context_type': "crop",
    #         'context': "root",
    #         'parameter': "length"
    #     }
    #
    #     response = requests.post(
    #         '{}/observations/contexts'.format(sens_url), json=payload)
    #
    #     res_str = response.json()
    #     print("Response: {}".format(res_str))
    #
    #     self.assertEqual(response.status_code, 200)
    #
    #     response = requests.get(
    #         '{}/observations/contexts'.format(sens_url))
    #
    #     res_str = response.json()
    #     print("Response: {}".format(res_str))

    # def test_internal_communication(self):
    #     from cryptography.fernet import Fernet
    #     token = {
    #         'user_id': 1,
    #         'is_admin': True
    #     }
    #
    #     token_json = json.dumps(token)
    #     message = token_json.encode()
    #     key = 'very-secret-key'
    #     f_key = Fernet.generate_key()
    #
    #     # f = Fernet(key.encode())
    #     f = Fernet(f_key)
    #     encrypted = f.encrypt(message)
    #
    #     header = create_header(token=encrypted, is_internal=True)
    #
    #     response = requests.get(
    #              '{}/farms/ping'.format(sens_url), headers=header)

if __name__ == "__main__":
    unittest.main()
