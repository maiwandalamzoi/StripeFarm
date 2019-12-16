import unittest
import json
import requests


def create_header(token=None):
    header = {'content-type': "application/json"}

    if token:
        header['Authorization'] = "Bearer " + str(token)

    return header


class TestEndpoints(unittest.TestCase):
    url = 'http://127.0.0.1:5001/api'
    auth_url = 'http://127.0.0.1:5003/api'

    # prod_url = 'http://proeftuin.win.tue.nl/api/v1'
    # url = prod_url
    # auth_url = prod_url

    admin_email = "info@proeftuin.nl"
    admin_password = "admin"

    def test_equipment_models(self):
        """
        Testing equipment model endpoints
        """
        def compare_eq_model(this, mdl_dict, data):
            this.assertEqual(mdl_dict["brand_name"], data["brand_name"])
            this.assertEqual(mdl_dict["model"], data["model"])
            this.assertEqual(mdl_dict["model_year"], data["model_year"])
            this.assertEqual(mdl_dict["series"], data["series"])
            this.assertEqual(mdl_dict["software_version"], data["software_version"])
            this.assertEqual(mdl_dict["description"], data["description"])

        def get_model(model_list, data):
            mdl = None

            for m in model_list:
                if m['brand_name'] == data['brand_name'] and \
                        m['model'] == data['model'] and \
                        m['model_year'] == data['model_year'] and \
                        m['series'] == data['series']:
                    mdl = m
                    break
            return mdl

        # Login as admin
        login_payload = {
            "email": self.admin_email,
            "password": self.admin_password
        }

        headers = create_header()

        response = requests.post(self.auth_url + '/auth/jwt_token', json=login_payload, headers=headers)
        self.assertEqual(response.status_code, 200)

        res_str = response.json()
        access_token = res_str['access_token']
        headers = create_header(access_token)

        payload = {
            "brand_name": "TestModel1",
            "model": "Test_DS50",
            "model_year": 2019,
            "series": "Test_WH2019Z",
            "software_version": "5.1",
            "description": "Test equipment model"
        }

        response = requests.post(self.url + '/datamaps/models', json=payload, headers=headers)
        self.assertEqual(response.status_code, 201)

        response = requests.get(self.url + '/datamaps/models', headers=headers)
        self.assertEqual(response.status_code, 200)

        res_str = response.json()
        models = json.loads(res_str)
        model = get_model(models, payload)

        self.assertIsNotNone(model)
        compare_eq_model(self, model, payload)

        response = requests.get('{}/datamaps/models/{}'.format(self.url, model['slug']), headers=headers)
        self.assertEqual(response.status_code, 200)

        model = response.json()
        compare_eq_model(self, model, payload)

        payload['model'] = "New test model"
        payload['model_year'] = 2077

        response = requests.put('{}/datamaps/models/{}'.format(self.url, model['slug']), json=payload, headers=headers)
        self.assertEqual(response.status_code, 201)

        response = requests.get(self.url + '/datamaps/models', headers=headers)
        self.assertEqual(response.status_code, 200)

        res_str = response.json()
        models = json.loads(res_str)
        model = get_model(models, payload)

        self.assertIsNotNone(model)
        compare_eq_model(self, model, payload)

        response = requests.delete('{}/datamaps/models/{}'.format(self.url, model['slug']), headers=headers)
        self.assertEqual(response.status_code, 204)

        response = requests.delete('{}/datamaps/models/{}'.format(self.url, model['slug']), headers=headers)
        self.assertEqual(response.status_code, 404)

    def test_datamaps(self):
        """
        Testing datamap endpoints
        """
        def compare_datamap(this, input, data):
            this.assertEqual(input["name"], data["name"])
            this.assertEqual(input["description"], data["description"])
            this.assertEqual(input["has_header"], data["has_header"])
            this.assertEqual(input["has_coordinate"], data["has_coordinate"])
            this.assertEqual(input["has_date"], data["has_date"])
            this.assertEqual(input["has_time"], data["has_time"])
            this.assertEqual(input["model_id"], data["model_id"])
            this.assertEqual(input["maps"], data["maps"])
            this.assertEqual(input["accessibility"], data["accessibility"])
            # this.assertEqual(input["owner_id"], data["owner_id"])

        # Login as admin
        login_payload = {
            "email": self.admin_email,
            "password": self.admin_password
        }

        headers = create_header()

        response = requests.post(self.auth_url + '/auth/jwt_token', json=login_payload, headers=headers)
        self.assertEqual(response.status_code, 200)

        res_str = response.json()
        access_token = res_str['access_token']
        headers = create_header(access_token)

        payload = {
            "name": "Test datamap old",
            "description": "This is only for testing purposes",
            "has_header": True,
            "has_coordinate": True,
            "has_date": True,
            "has_time": True,
            "model_id": None,
            "maps": [],
            "accessibility": "public",
            # "owner_id": 1
        }

        map_data = {
            "column": "Date and time",
            "observation": {
                "type": "datetime",
                "context": "datetime",
                "parameter": "year-month-day hh:mm:ss",
                "description": "Date and time of observation",
                "unit": None,
                "condition": None
            }
        }

        payload['maps'].append(map_data)

        response = requests.post(self.url + '/datamaps', json=payload, headers=headers)
        self.assertEqual(response.status_code, 201)

        response = requests.get(self.url + '/datamaps', headers=headers)
        self.assertEqual(response.status_code, 200)

        res_str = response.json()
        datamaps = json.loads(res_str)

        datamap = None
        for dm in datamaps:
            if dm['name'] == payload['name']:
                datamap = dm
                break

        self.assertIsNotNone(datamap)
        compare_datamap(self, datamap, payload)

        payload["name"] = "Test datamap new"
        payload["description"] = "Changing data"
        payload["has_header"] = False
        payload["has_coordinate"] = False
        payload["has_date"] = False
        payload["has_time"] = False
        payload["accessibility"] = "private"
        # payload["owner_id"] = 2

        response = requests.put('{}/datamaps/{}'.format(self.url, datamap['id']), json=payload, headers=headers)
        self.assertEqual(response.status_code, 201)

        response = requests.get('{}/datamaps/{}'.format(self.url, datamap['id']), headers=headers)
        self.assertEqual(response.status_code, 200)

        datamap = response.json()
        compare_datamap(self, datamap, payload)

        response = requests.delete('{}/datamaps/{}'.format(self.url, datamap['id']), headers=headers)
        self.assertEqual(response.status_code, 204)

        response = requests.get('{}/datamaps/{}'.format(self.url, datamap['id']), headers=headers)
        self.assertEqual(response.status_code, 404)

        response = requests.delete('{}/datamaps/{}'.format(self.url, datamap['id']), headers=headers)
        self.assertEqual(response.status_code, 404)

    # def test_no_header(self):
    #     # Login as admin
    #     # login_payload = {
    #     #     "email": self.admin_email,
    #     #     "password": self.admin_password
    #     # }
    #
    #     # self.auth_url = 'http://proeftuin.win.tue.nl/api/v1'
    #     # self.url = self.auth_url
    #
    #     # headers = create_header()
    #     # response = requests.post(self.auth_url + '/auth/jwt_token', json=login_payload, headers=headers)
    #     # self.assertEqual(response.status_code, 200)
    #     #
    #     # res_str = response.json()
    #     # access_token = res_str.get('access_token')
    #     # user_id = res_str.get('user_id')
    #     # headers = create_header(access_token)
    #
    #     # response = requests.get(self.url + '/datamaps', headers=headers)
    #     response = requests.get(self.url + '/datamaps')
    #     res_str = response.json()
    #     print(res_str)

    # def test_get_specific_datamap(self):
    #     # Login as admin
    #     payload = {
    #         "first_name": "test_first_name",
    #         "last_name": "test_last_name",
    #         "email": "testname@email.com",
    #         "password": "123456"
    #     }
    #
    #     response = requests.post(self.auth_url + '/users/register', json=payload)
    #     self.assertEqual(response.status_code, 201)
    #
    #     res_str = response.json()
    #     access_token = res_str['access_token']
    #     user_id = res_str['user_id']
    #     headers = create_header(access_token)
    #
    #     response = requests.get('{}/datamaps/{}'.format(self.url, 18), headers=headers)
    #     # self.assertEqual(response.status_code, 200)
    #
    #     response = requests.delete('{}/users/{}'.format(self.auth_url, user_id), headers=headers)
    #     self.assertEqual(response.status_code, 204)


if __name__ == "__main__":
    unittest.main()
