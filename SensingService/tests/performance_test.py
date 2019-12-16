import json
import requests
from requests_toolbelt.multipart.encoder import MultipartEncoder
from SensingService.tests.test_utils import *
from timeit import default_timer as timer

sens_url = 'http://127.0.0.1:5002/api'
auth_url = 'http://127.0.0.1:5003/api'
map_url = 'http://127.0.0.1:5001/api'


class PerformanceTest(object):
    user_header = None
    user_id = None

    field_area_coor = None
    map_file = None

    folder_name = "test_data/"

    total_farm = 2
    total_cfield = 1

    test_iter_nr = 100

    def create_farm(self, name):
        farm_id = None

        payload = create_farm_payload(name, "public")

        response = requests.post(sens_url + '/farms', json=payload, headers=self.user_header)
        if response.status_code is 201:
            res_str = response.json()
            farm_id = res_str.get("farm_id")
        else:
            response = requests.get('{}/farms'.format(sens_url), headers=self.user_header)

            if response.status_code is 200:
                res_str = response.json()

                farms = json.loads(res_str)

                farm = None
                for fm in farms:
                    if fm['name'] == name:
                        farm = fm
                        break

                if farm:
                    farm_id = farm.get("id")

        return farm_id

    def create_field(self, farm_id, name):
        field_id = None

        field_payload = {
            'field_name': name,
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

        self.field_area_coor = field_payload['coordinates']

        response = requests.post('{}/farms/{}/fields'.format(sens_url, farm_id),
                                 json=field_payload, headers=self.user_header)
        if response.status_code is 201:
            res_str = response.json()
            field_id = res_str["field_id"]

        return field_id

    def create_crop_field(self, farm_id, field_id, name):
        cfield_id = None

        cf_payload = {
            'name': name,
            'crop_type_id': 1,
            'period_start': "2019-01-22",
            'period_end': "Jul-06-2019",
            'coordinates': self.field_area_coor,
            'accessibility': "public"
        }

        response = requests.post(
            '{}/farms/{}/fields/{}/crop_fields'.format(sens_url, farm_id, field_id),
            json=cf_payload, headers=self.user_header)
        if response.status_code is 201:
            res_str = response.json()
            cfield_id = res_str["crop_field_id"]

        return cfield_id

    def create_equipment(self, farm_id):
        eq_id = None

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
                                 headers=self.user_header)
        if response.status_code is 201:
            res_str = response.json()
            eq_id = res_str.get("equipment_id")

        return eq_id

    def create_sensing_data(self, test_col=5, sample_data=10, test_nr=None):
        csv_name, datamap_payload = create_dummy_csv(has_header=False,
                                                     has_coordinate=True,
                                                     has_date=True,
                                                     has_time=True,
                                                     test_nr=test_nr,
                                                     sample_data=sample_data,
                                                     test_col=test_col)

        return csv_name, datamap_payload

    def set_map_filename(self, name):
        self.map_file = name

    def get_map_filename(self):
        return self.map_file

    def create_datamap(self, farm_id, payload):

        # Get map ID
        map_id = store_datamap(map_url, farm_id, self.user_header, payload)
        return map_id

    def upload_data(self, data_nr, farm_id, field_id, crop_field_id, map_id):
        csv_name = "{}datamap_test_{}.csv".format(self.folder_name, data_nr)

        f = open(csv_name, 'rb')
        mp_encoder = MultipartEncoder(
            fields={
                'farm_id': str(farm_id),
                'field_id': str(field_id),
                'crop_field_id': str(crop_field_id),
                'equipment_id': None,
                'map_id': str(map_id),
                'accessibility': "public",

                # plain file object, no filename or mime type produces a
                # Content-Disposition header with just the part name
                'file': (csv_name, f.read(), 'text/plain'),
            }
        )

        now = datetime.now()
        dt_string = now.strftime("%Y-%m-%d %H:%M:%S")

        params = {
            'latitude': 10.12345,
            'longitude': 15.12345,
            'datetime': dt_string
        }

        # Add content-type in the header
        headers = self.user_header
        headers['Content-Type'] = mp_encoder.content_type

        # Send streaming data
        start = timer()

        response = requests.post(
            "{}/observations/upload".format(sens_url),
            params=params,
            data=mp_encoder,  # The MultipartEncoder is posted as data, don't use files=...!
            # The MultipartEncoder provides the content-type header with the boundary:
            headers=headers
        )

        end = timer()
        elapsed_time = end - start

        f.close()
        # res_str = response.json()

        return elapsed_time

    def download_data(self, farm_id, field_id, crop_field_id):
        # Read observation data
        params = {
            "type": "environment",
            "farm_id": farm_id,
            "field_id": field_id,
            "crop_field_id": crop_field_id,
            "equipment_id": None
        }

        start = timer()
        response = requests.get('{}/observations'.format(sens_url),
                                params=params,
                                headers=self.user_header)

        res_str = response.json()

        # now write output to a file
        observationFile = open("observation.json", "w")
        # magic happens here to make it pretty-printed
        observationFile.write(json.dumps(json.loads(res_str), indent=4, sort_keys=True))
        observationFile.close()

        end = timer()
        elapsed_time = end - start

        res_str = response.json()
        # print("Response get data: {}".format(res_str))

        return elapsed_time

    def delete_data(self, farm_id, field_id, crop_field_id):
        # Delete observation data
        params = {
            "type": "environment",
            "farm_id": farm_id,
            "field_id": field_id,
            "crop_field_id": crop_field_id
        }
        response = requests.delete('{}/observations'.format(sens_url),
                                   params=params,
                                   headers=self.user_header)

        if response.status_code is not 204:
            print("Delete farm data {} with response: {}".format(farm_id, response))

    def prepare_data_set(self):
        map_load = None
        nr_test_files = 10

        # time_list = []

        for i in range(nr_test_files):
            # start = timer()
            csv_name, map_load = pt.create_sensing_data(test_col=50,
                                                        sample_data=1050,
                                                        test_nr=i)
            # end = timer()
            # time_list.append(end - start)

        # # Save time list
        # with open('{}timer_in_sec.txt'.format(self.folder_name), 'w') as f:
        #     for item in time_list:
        #         f.write("%s\n" % item)

        map_file = '{}map.json'.format(self.folder_name)
        with open(map_file, 'w') as fp:
            json.dump(map_load, fp, sort_keys=True, indent=4)

        self.set_map_filename(map_file)

    def load_db(self):
        self.user_header, self.user_id = admin_login(auth_url)

        farm_id = None
        field_id = None
        cfield_id = None
        map_id = None

        # map_filename = self.get_map_filename()
        map_filename = '{}map.json'.format(self.folder_name)
        with open(map_filename, 'r') as fp:
            map_payload = json.load(fp)

        # Prepare data
        nr_farm = self.total_farm + 1
        for i in range(nr_farm):
            name = str(i)
            farm_id = self.create_farm(name)
            field_id = self.create_field(farm_id, name)

            if i == 0:
                # eq_id = self.create_equipment(farm_id)
                map_id = self.create_datamap(farm_id, map_payload)

            for j in range(self.total_cfield):
                cfield_id = self.create_crop_field(farm_id, field_id, str(j))

                # # Upload data except for the last farm
                # if i < (nr_farm - 1):
                #     elapsed_time = self.upload_data(j, farm_id, field_id, cfield_id, map_id)
                #     print(elapsed_time)

        print("farm_id = {}\nfield_id = {}\ncfield_id = {}\nmap_id = {}".format(
            farm_id, field_id, cfield_id, map_id
        ))

    def upload_test(self, farm_id, field_id, cfield_id, map_id):
        print("upload test")
        time_list = []
        data_nr = self.total_cfield

        self.user_header, self.user_id = admin_login(auth_url)

        # iter = self.test_iter_nr
        iter = 1

        for i in range(iter):
            elapsed_time = self.upload_data(data_nr, farm_id, field_id, cfield_id, map_id)
            time_list.append(elapsed_time)

            # self.delete_data(farm_id, field_id, cfield_id)

        # Save time list
        filename = '{}upload_timer_in_sec.txt'.format(self.folder_name)

        with open(filename, 'w') as f:
            for item in time_list:
                f.write("%s\n" % item)

    def download_test(self, farm_id, field_id, crop_field_id):
        time_list = []

        self.user_header, self.user_id = admin_login(auth_url)

        # iter = self.test_iter_nr
        iter = 1

        for i in range(iter):
            elapsed_time = self.download_data(farm_id, field_id, crop_field_id)
            time_list.append(elapsed_time)

        # Save time list
        filename = '{}download_timer_in_sec.txt'.format(self.folder_name)

        with open(filename, 'w') as f:
            for item in time_list:
                f.write("%s\n" % item)


if __name__ == '__main__':
    # Prepare test data
    pt = PerformanceTest()
    # pt.prepare_data_set()
    # pt.load_db()

    farm_id = 183
    field_id = 74
    cfield_id = 65
    map_id = 69
    # pt.upload_test(farm_id, field_id, cfield_id, map_id)

    pt.download_test(farm_id, field_id, cfield_id)


