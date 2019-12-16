import requests


class MappingApi:
    @staticmethod
    def get_datamap_by_id(map_id, headers):
        url = 'http://mapping:5000/api/datamaps/{}'.format(map_id)
        response = requests.request(method="GET", url=url, headers=headers)

        if response.status_code == requests.codes.ok:
            return response.json()

        return None

    @staticmethod
    def get_equipment_model_id(model_id, headers):
        url = 'http://mapping:5000/api/datamaps/models/id/{}'.format(model_id)
        response = requests.request(method="GET", url=url, headers=headers)

        if response.status_code == requests.codes.ok:
            return response.json()

        return None
