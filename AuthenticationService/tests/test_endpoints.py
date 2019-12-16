import unittest
import json
import requests
import jwt
import datetime


def create_header(token=None):
    header = {'content-type': "application/json"}

    if token:
        header['Authorization'] = "Bearer " + str(token)

    return header


def filter_dict_status_list(status, dict_list):
    ret_list = []

    if dict_list and dict_list["allowed_access"]:
        ret_list = list(filter(lambda res: res['status'] == status, dict_list["allowed_access"]))

    return ret_list


class TestEndpoints(unittest.TestCase):
    url = 'http://127.0.0.1:5003/api'
    # url = 'http://proeftuin.win.tue.nl/api/v1'

    admin_email = "info@proeftuin.nl"
    admin_password = "admin"

    def test_user_register(self):
        payload = {
            "first_name": "test_first_name",
            "last_name": "test_last_name",
            "email": "tname@gmail.com",
            "password": "123456"
        }

        response = requests.post(self.url + '/users/register', json=payload)
        self.assertEqual(response.status_code, 201)

        res_str = response.json()
        access_token = res_str['access_token']
        user_id = res_str["user_id"]
        headers = create_header(access_token)

        response = requests.get('{}/users/{}'.format(self.url, user_id),
                                headers=headers)
        self.assertEqual(response.status_code, 200)
        res_str = response.json()

        self.assertEqual(payload["first_name"], res_str["first_name"])
        self.assertEqual(payload["last_name"], res_str["last_name"])
        self.assertEqual(payload["email"], res_str["email"])

        # Update
        payload["first_name"] = "another_first"
        payload["last_name"] = "another_last"
        payload["email"] = "another_email@test_email.com"

        response = requests.put('{}/users/{}'.format(self.url, user_id),
                                json=payload,
                                headers=headers)
        self.assertEqual(response.status_code, 201)

        response = requests.get('{}/users/{}'.format(self.url, user_id),
                                headers=headers)
        self.assertEqual(response.status_code, 200)
        res_str = response.json()

        self.assertEqual(payload["first_name"], res_str["first_name"])
        self.assertEqual(payload["last_name"], res_str["last_name"])
        self.assertEqual(payload["email"], res_str["email"])

        response = requests.delete(self.url + '/users/' + str(user_id), headers=headers)
        self.assertEqual(response.status_code, 204)

    def test_user_login(self):
        payload = {
            "first_name": "test_first_name",
            "last_name": "test_last_name",
            "email": "tname@gmail.com",
            "password": "123456"
        }

        response = requests.post(self.url + '/users/register', json=payload)
        self.assertEqual(response.status_code, 201)

        res_str = response.json()
        access_token = res_str['access_token']
        refresh_token = res_str['refresh_token']
        user_id = res_str['user_id']

        # print(access_token)
        headers = create_header(access_token)

        payload = {
                "method": "GET",
                "resource": {
                    "name": "observation",
                    "meta": {
                        "farm_id": 1
                    }
                }
            }

        response = requests.post(self.url + '/auth/access_verification', json=payload, headers=headers)
        res_str = response.json()
        # print("access_verification Result: {} type: {}".format(res_str, type(res_str)))
        self.assertEqual(response.status_code, 200)

        login_payload = {
            "email": "tname@gmail.com",
            "password": "123456"
        }

        response = requests.post(self.url + '/auth/jwt_token', json=login_payload, headers=headers)
        self.assertEqual(response.status_code, 200)

        headers = create_header(refresh_token)
        response = requests.get(self.url + '/auth/refresh_token',
                                headers=headers)
        res_str = response.json()
        access_token = res_str['access_token']

        headers = create_header(access_token)

        response = requests.post(self.url + '/auth/access_verification', json=payload, headers=headers)
        res_str = response
        # print("access_verification Result: {} type: {}".format(res_str, type(res_str)))
        self.assertEqual(response.status_code, 200)

        # Test JWT expired
        jwt_secret = 'very-secret-jwt-key'

        now = datetime.datetime.now()
        new_iat = now - datetime.timedelta(minutes=15, seconds=1)
        new_exp = now - datetime.timedelta(seconds=1)

        iat_timestamp = datetime.datetime.timestamp(new_iat)
        exp_timestamp = datetime.datetime.timestamp(new_exp)

        dcd_token = jwt.decode(refresh_token, jwt_secret, algorithms='HS256')
        dcd_token['iat'] = iat_timestamp
        dcd_token['nbf'] = iat_timestamp
        dcd_token['exp'] = exp_timestamp

        err_token = jwt.encode(dcd_token, jwt_secret, algorithm='HS256').decode("utf-8")
        headers = create_header(err_token)

        response = requests.get(self.url + '/auth/refresh_token', headers=headers)
        self.assertEqual(response.status_code, 401)

        # Delete user
        headers = create_header(access_token)
        response = requests.delete(self.url + '/users/' + str(user_id), headers=headers)
        self.assertEqual(response.status_code, 204)

    def test_add_role_permissions(self):
        login_payload = {
            "email": self.admin_email,
            "password": self.admin_password
        }

        headers = {'content-type': "application/json"}

        response = requests.post(self.url + '/auth/jwt_token', json=login_payload, headers=headers)
        self.assertEqual(response.status_code, 200)

        res_str = response.json()
        access_token = res_str['access_token']
        headers = create_header(access_token)

        role_name_list = ["test_role_1", "test_role_2"]

        payload = {
            'role': role_name_list[0],
            'permissions': [
                {
                    'resource': "farm",
                    'methods': ["read", "create", "update"]
                },
                {
                    'resource': "field",
                    'methods': ["read", "create", "update", "delete"]
                },
                {
                    'resource': "crop_field",
                    'methods': ["read"]
                }
            ]
        }

        response = requests.post(self.url + '/roles/permissions', json=payload, headers=headers)
        # res_str = response

        self.assertEqual(response.status_code, 200)

        payload = {
            'role': role_name_list[1],
            'permissions': [
                {
                    'resource': "farm",
                    'methods': ["read"]
                },
                {
                    'resource': "field",
                    'methods': ["read"]
                },
                {
                    'resource': "crop_field",
                    'methods': ["read"]
                }
            ]
        }

        response = requests.post(self.url + '/roles/permissions', json=payload, headers=headers)
        # res_str = response.json()
        self.assertEqual(response.status_code, 200)

        response = requests.get(self.url + '/roles/permissions', headers=headers)
        res_str = response.json()
        self.assertEqual(response.status_code, 200)

        role_list = json.loads(res_str)

        for rname in role_name_list:
            role_id = None

            for r in role_list:
                if r["role"] == rname:
                    role_id = r["id"]
                    break

            self.assertIsNotNone(role_id)

            response = requests.get(self.url + '/roles/permissions/{}'.format(role_id), headers=headers)
            # res_str = response.json()
            self.assertEqual(response.status_code, 200)

            payload = {
                'role': rname,
                'permissions': [
                    {
                        'resource': "farm",
                        'methods': ["read"]
                    },
                    {
                        'resource': "field",
                        'methods': ["read"]
                    }
                ]
            }

            response = requests.put(self.url + '/roles/permissions/{}'.format(role_id),
                                    json=payload, headers=headers)
            self.assertEqual(response.status_code, 201)

            response = requests.delete(self.url + '/roles/permissions/{}'.format(role_id), headers=headers)
            self.assertEqual(response.status_code, 204)

            response = requests.delete(self.url + '/roles/{}'.format(role_id), headers=headers)
            self.assertEqual(response.status_code, 204)

    def test_access_verification_admin(self):
        def check_response(this, data):
            this.assertEqual(response.status_code, 200)
            this.assertGreater(len(filter_dict_status_list("public", data)), 0)
            this.assertGreater(len(filter_dict_status_list("private", data)), 0)
            this.assertEqual(data["valid"], True)
            this.assertEqual(data["is_admin"], True)

        login_payload = {
            "email": self.admin_email,
            "password": self.admin_password
        }

        headers = {'content-type': "application/json"}

        response = requests.post(self.url + '/auth/jwt_token', json=login_payload, headers=headers)
        self.assertEqual(response.status_code, 200)

        res_str = response.json()
        access_token = res_str['access_token']
        headers = create_header(access_token)

        access_payload = {
          "method": None,
          "resource": {
            "name": None,
            "meta": None
          }
        }

        method_list = ["GET", "POST", "PUT", "DELETE"]
        resource_list = ["farm",
                         "field",
                         "crop_field",
                         "observation",
                         "equipment",
                         "datamap",
                         "farm_user",
                         "other"]

        for method in method_list:
            for resource in resource_list:
                access_payload["method"] = method
                access_payload["resource"]["name"] = resource

                response = requests.post(self.url + '/auth/access_verification', json=access_payload, headers=headers)
                data_res = response.json()
                check_response(self, data_res)

    def test_access_verification_user(self):
        payload = {
            "first_name": "test_first_name",
            "last_name": "test_last_name",
            "email": "testname@email.com",
            "password": "123456"
        }

        response = requests.post(self.url + '/users/register', json=payload)
        self.assertEqual(response.status_code, 201)

        res_str = response.json()
        access_token = res_str['access_token']
        user_id = res_str['user_id']
        headers = create_header(access_token)

        access_payload = {
            "method": None,
            "resource": {
                "name": None,
                "meta": None
            }
        }

        resource_list = ["farm",
                         "field",
                         "crop_field",
                         "observation",
                         "equipment",
                         "datamap",
                         "other",
                         "farm_user"]

        no_access_resource = "farm_user"

        access_payload["method"] = "GET"

        for resource in resource_list:
            access_payload["resource"]["name"] = resource
            response = requests.post(self.url + '/auth/access_verification', json=access_payload, headers=headers)
            data_res = response.json()

            self.assertEqual(response.status_code, 200)

            if resource == no_access_resource:
                self.assertEqual(len(filter_dict_status_list("public", data_res)), 0)
                self.assertEqual(data_res["valid"], False)
            else:
                self.assertEqual(len(filter_dict_status_list("public", data_res)), 1)
                self.assertEqual(data_res["valid"], True)

            self.assertEqual(len(filter_dict_status_list("private", data_res)), 0)
            self.assertEqual(data_res["is_admin"], False)

        access_payload["method"] = "POST"
        for resource in resource_list:
            access_payload["resource"]["name"] = resource
            response = requests.post(self.url + '/auth/access_verification', json=access_payload, headers=headers)
            data_res = response.json()

            self.assertEqual(response.status_code, 200)

            if resource == "farm" or \
                    resource == "datamap":
                self.assertEqual(data_res["valid"], True)
            else:
                self.assertEqual(data_res["valid"], False)

            self.assertEqual(len(filter_dict_status_list("public", data_res)), 0)
            self.assertEqual(len(filter_dict_status_list("private", data_res)), 0)
            self.assertEqual(data_res["is_admin"], False)

        method_list = ["PUT", "DELETE"]
        for method in method_list:
            for resource in resource_list:
                access_payload["resource"]["name"] = resource
                access_payload["method"] = method
                response = requests.post(self.url + '/auth/access_verification', json=access_payload, headers=headers)
                data_res = response.json()

                self.assertEqual(response.status_code, 200)

                self.assertEqual(len(filter_dict_status_list("public", data_res)), 0)
                self.assertEqual(len(filter_dict_status_list("private", data_res)), 0)
                self.assertEqual(data_res["valid"], False)
                self.assertEqual(data_res["is_admin"], False)

        response = requests.delete('{}/users/{}'.format(self.url, user_id), headers=headers)
        self.assertEqual(response.status_code, 204)

    def test_add_farm_user_by_email(self):
        payload = {
            "first_name": "test_first_name",
            "last_name": "test_last_name",
            "email": "testname@email.com",
            "password": "123456"
        }

        response = requests.post(self.url + '/users/register', json=payload)
        self.assertEqual(response.status_code, 201)

        res_str = response.json()
        access_token = res_str['access_token']
        user_id = res_str['user_id']
        headers = create_header(access_token)

        farm_id = 1

        role_payload = {
            "role": "farm_admin",
            "user_id": user_id,
        }

        # User creates new farm and set himself as a farm admin
        # role_payload["role"] = "farm_admin"
        param = {"use_email": True}
        response = requests.post('{}/farm_users/{}'.format(self.url, farm_id),
                                 params=param,
                                 json=role_payload,
                                 headers=headers)
        self.assertEqual(response.status_code, 400)

        role_payload["user_id"] = None
        role_payload["email"] = payload["email"]
        response = requests.post('{}/farm_users/{}'.format(self.url, farm_id),
                                 params=param,
                                 json=role_payload,
                                 headers=headers)
        self.assertEqual(response.status_code, 201)

        response = requests.get('{}/farm_users/{}'.format(self.url, farm_id), headers=headers)
        self.assertEqual(response.status_code, 200)

        response = requests.delete('{}/farm_users/{}/users/{}'.format(self.url, farm_id, user_id), headers=headers)
        self.assertEqual(response.status_code, 204)

        response = requests.delete('{}/users/{}'.format(self.url, user_id), headers=headers)
        self.assertEqual(response.status_code, 204)

    def test_access_verification_farm_admin(self):
        payload = {
            "first_name": "test_first_name",
            "last_name": "test_last_name",
            "email": "testname@email.com",
            "password": "123456"
        }

        response = requests.post(self.url + '/users/register', json=payload)
        self.assertEqual(response.status_code, 201)

        res_str = response.json()
        access_token = res_str['access_token']
        user_id = res_str['user_id']
        headers = create_header(access_token)

        farm_id = 1
        role_payload = {
            "role": "farmer",
            "user_id": user_id,
            "fields": []
        }

        response = requests.post('{}/farm_users/{}'.format(self.url, farm_id), json=role_payload, headers=headers)
        self.assertEqual(response.status_code, 400)

        # User creates new farm and set himself as a farm admin
        role_payload["role"] = "farm_admin"
        response = requests.post('{}/farm_users/{}'.format(self.url, farm_id), json=role_payload, headers=headers)
        self.assertEqual(response.status_code, 201)

        response = requests.get('{}/farm_users/{}'.format(self.url, farm_id), headers=headers)
        self.assertEqual(response.status_code, 200)

        response = requests.get('{}/farm_users/{}/users/{}'.format(self.url, farm_id, user_id), headers=headers)
        self.assertEqual(response.status_code, 200)

        access_payload = {
            "method": None,
            "resource": {
                "name": None,
                "meta": {
                    "farm_id": farm_id
                }
            }
        }

        resource_list = ["farm",
                         "field",
                         "crop_field",
                         "observation",
                         "equipment",
                         "datamap",
                         "other",
                         "farm_user"]

        method_list = ["GET", "POST", "PUT", "DELETE"]

        for method in method_list:
            access_payload["method"] = method

            for resource in resource_list:
                access_payload["resource"]["name"] = resource

                response = requests.post(self.url + '/auth/access_verification', json=access_payload, headers=headers)
                data_res = response.json()

                self.assertEqual(response.status_code, 200)

                status_count = 0
                if method == "GET":
                    status_count = 1

                self.assertEqual(len(filter_dict_status_list("public", data_res)), status_count)
                self.assertEqual(len(filter_dict_status_list("private", data_res)), status_count)

                if resource == "other":
                    if method == "GET":
                        self.assertEqual(data_res["valid"], True)
                    else:
                        self.assertEqual(data_res["valid"], False)
                else:
                    self.assertEqual(data_res["valid"], True)
                self.assertEqual(data_res["is_admin"], False)

        response = requests.delete('{}/farm_users/{}/users/{}'.format(self.url, farm_id, user_id), headers=headers)
        self.assertEqual(response.status_code, 204)

        response = requests.delete('{}/users/{}'.format(self.url, user_id), headers=headers)
        self.assertEqual(response.status_code, 204)

    def test_access_verification_farmer(self):
        # admin login
        login_payload = {
            "email": self.admin_email,
            "password": self.admin_password
        }

        headers = {'content-type': "application/json"}

        response = requests.post(self.url + '/auth/jwt_token', json=login_payload, headers=headers)
        self.assertEqual(response.status_code, 200)

        # admin get token
        res_str = response.json()
        adm_access_token = res_str['access_token']
        adm_headers = create_header(adm_access_token)

        jwt_secret = 'very-secret-jwt-key'
        dcd_token = jwt.decode(adm_access_token, jwt_secret, algorithms='HS256')
        adm_user_id = dcd_token['identity']['user_id']

        # create farm user: farm admin
        farm_id = 1
        role_payload = {
            "role": "farm_admin",
            "user_id": adm_user_id,
            "fields": []
        }

        # User creates new farm and set himself as a farm admin
        response = requests.post('{}/farm_users/{}'.format(self.url, farm_id), json=role_payload, headers=adm_headers)
        self.assertEqual(response.status_code, 201)

        payload = {
            "first_name": "test_first_name",
            "last_name": "test_last_name",
            "email": "testname@email.com",
            "password": "123456"
        }

        response = requests.post(self.url + '/users/register', json=payload)
        self.assertEqual(response.status_code, 201)

        res_str = response.json()
        access_token = res_str['access_token']
        user_id = res_str['user_id']
        headers = create_header(access_token)

        role_payload["role"] = "farmer"
        role_payload["user_id"] = user_id
        response = requests.post('{}/farm_users/{}'.format(self.url, farm_id), json=role_payload, headers=adm_headers)
        self.assertEqual(response.status_code, 201)

        access_payload = {
            "method": None,
            "resource": {
                "name": None,
                "meta": {
                    "farm_id": farm_id
                }
            }
        }

        resource_list = ["farm",
                         "field",
                         "crop_field",
                         "observation",
                         "equipment",
                         "datamap",
                         "other",
                         "farm_user"]

        full_access_resource = ["field",
                                "crop_field",
                                "observation",
                                "equipment",
                                "datamap",]

        method_list = ["GET", "POST", "PUT", "DELETE"]

        for method in method_list:
            access_payload["method"] = method

            for resource in resource_list:
                access_payload["resource"]["name"] = resource

                response = requests.post(self.url + '/auth/access_verification', json=access_payload, headers=headers)
                data_res = response.json()

                self.assertEqual(response.status_code, 200)

                status_count = 0
                if method == "GET":
                    status_count = 1

                if resource in full_access_resource:
                    self.assertEqual(len(filter_dict_status_list("public", data_res)), status_count)
                    self.assertEqual(len(filter_dict_status_list("private", data_res)), status_count)
                    self.assertEqual(data_res["valid"], True)
                elif resource == "farm" or resource == "other":
                    if method == "GET":
                        self.assertEqual(len(filter_dict_status_list("public", data_res)), status_count)
                        self.assertEqual(len(filter_dict_status_list("private", data_res)), status_count)
                        self.assertEqual(data_res["valid"], True)
                    else:
                        self.assertEqual(data_res["valid"], False)
                elif resource == "farm_user":
                    self.assertEqual(data_res["valid"], False)
                else:
                    raise NotImplementedError

                self.assertEqual(data_res["is_admin"], False)

        # Remove farmer
        response = requests.delete('{}/farm_users/{}/users/{}'.format(self.url, farm_id, user_id), headers=adm_headers)
        self.assertEqual(response.status_code, 204)

        # Remove farm admin
        response = requests.delete('{}/farm_users/{}/users/{}'.format(self.url, farm_id, adm_user_id),
                                   headers=adm_headers)
        self.assertEqual(response.status_code, 204)

        response = requests.delete('{}/users/{}'.format(self.url, user_id), headers=headers)
        self.assertEqual(response.status_code, 204)

    def test_access_verification_researcher(self):
        # admin login
        login_payload = {
            "email": self.admin_email,
            "password": self.admin_password
        }

        headers = {'content-type': "application/json"}

        response = requests.post(self.url + '/auth/jwt_token', json=login_payload, headers=headers)
        self.assertEqual(response.status_code, 200)

        # admin get token
        res_str = response.json()
        adm_access_token = res_str['access_token']
        adm_headers = create_header(adm_access_token)

        jwt_secret = 'very-secret-jwt-key'
        dcd_token = jwt.decode(adm_access_token, jwt_secret, algorithms='HS256')
        adm_user_id = dcd_token['identity']['user_id']

        # create farm user: farm admin
        farm_id = 1
        role_payload = {
            "role": "farm_admin",
            "user_id": adm_user_id,
            "fields": []
        }

        # User creates new farm and set himself as a farm admin
        response = requests.post('{}/farm_users/{}'.format(self.url, farm_id), json=role_payload, headers=adm_headers)
        self.assertEqual(response.status_code, 201)

        payload = {
            "first_name": "test_first_name",
            "last_name": "test_last_name",
            "email": "testname@email.com",
            "password": "123456"
        }

        response = requests.post(self.url + '/users/register', json=payload)
        self.assertEqual(response.status_code, 201)

        res_str = response.json()
        access_token = res_str['access_token']
        user_id = res_str['user_id']
        headers = create_header(access_token)

        role_payload["role"] = "researcher"
        role_payload["user_id"] = user_id
        response = requests.post('{}/farm_users/{}'.format(self.url, farm_id), json=role_payload, headers=adm_headers)
        self.assertEqual(response.status_code, 201)

        access_payload = {
            "method": None,
            "resource": {
                "name": None,
                "meta": {
                    "farm_id": farm_id
                }
            }
        }

        resource_list = ["farm",
                         "field",
                         "crop_field",
                         "observation",
                         "equipment",
                         "datamap",
                         "other",
                         "farm_user"]

        method_list = ["GET", "POST", "PUT", "DELETE"]

        for method in method_list:
            access_payload["method"] = method

            for resource in resource_list:
                access_payload["resource"]["name"] = resource

                response = requests.post(self.url + '/auth/access_verification', json=access_payload, headers=headers)
                data_res = response.json()

                self.assertEqual(response.status_code, 200)

                status_count = 0
                if method == "GET":
                    status_count = 1

                if resource == "observation":
                    if method == "GET":
                        self.assertEqual(data_res["valid"], True)
                        self.assertEqual(len(filter_dict_status_list("public", data_res)), status_count)
                        self.assertEqual(len(filter_dict_status_list("private", data_res)), status_count)

                    elif (method == "POST" or
                            method == "PUT"):
                        self.assertEqual(data_res["valid"], True)
                    else:
                        self.assertEqual(data_res["valid"], False)
                elif resource == "farm_user":
                    self.assertEqual(data_res["valid"], False)
                else:
                    if method == "GET":
                        self.assertEqual(data_res["valid"], True)
                        self.assertEqual(len(filter_dict_status_list("public", data_res)), status_count)
                        self.assertEqual(len(filter_dict_status_list("private", data_res)), status_count)
                    else:
                        self.assertEqual(data_res["valid"], False)

                self.assertEqual(data_res["is_admin"], False)

        # Remove farmer
        response = requests.delete('{}/farm_users/{}/users/{}'.format(self.url, farm_id, user_id), headers=adm_headers)
        self.assertEqual(response.status_code, 204)

        # Remove farm admin
        response = requests.delete('{}/farm_users/{}/users/{}'.format(self.url, farm_id, adm_user_id),
                                   headers=adm_headers)
        self.assertEqual(response.status_code, 204)

        response = requests.delete('{}/users/{}'.format(self.url, user_id), headers=headers)
        self.assertEqual(response.status_code, 204)

    # def test_memleak(self):
    #     import psutil
    #
    #     process = psutil.Process(os.getpid())
    #     mem0 = process.memory_info().rss
    #     print('Memory Usage After Action', mem0 / (1024 ** 2), 'MB')

if __name__ == "__main__":
    unittest.main()
