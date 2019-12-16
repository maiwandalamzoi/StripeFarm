import requests


class AuthApi:
    @staticmethod
    def verify_request(payload, headers):
        url = 'http://user:5000/api/auth/access_verification'
        response = requests.post(url, json=payload, headers=headers)

        return response.json(), response.status_code
