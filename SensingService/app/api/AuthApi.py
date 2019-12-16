import requests


class AuthApi:
    @staticmethod
    def verify_request(payload, headers):
        url = 'http://user:5000/api/auth/access_verification'
        response = requests.post(url, json=payload, headers=headers)

        return response.json(), response.status_code

    @staticmethod
    def add_farm_user(role, user_id, farm_id, headers):
        url = 'http://user:5000/api/farm_users/{}'.format(farm_id)

        payload = {
            "role": role,
            "user_id": user_id,
            "fields": []
        }

        response = requests.post(url, json=payload, headers=headers)
        return response.json(), response.status_code

    @staticmethod
    def delete_farm_users(farm_id, headers):
        url = 'http://user:5000/api/farm_users/{}'.format(farm_id)

        response = requests.delete(url, headers=headers)
        return response.status_code

