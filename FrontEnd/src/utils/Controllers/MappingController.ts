/* This controller contains all the functionality of retrieving the datamap from the data-
 * Sensing service.
 */
import Request from 'request-promise';
import { refreshToken, getToken } from './UserController';
import { DataMap } from '../../common/DataMap';
import { AccessibilityType } from '../../common/AccessibilityType';
import { apiUrl } from '../../settings';
import { getOptions } from './ReqeustUtils';
import axios from 'axios';

/**
 * importData() makes an import data request and returns boolean whether successful
 * @param farmId, the id of a farm
 * @param fieldId, the id of a field
 * @param equId, the id of an equipment
 * @param datamapId, the id of a datamap
 * @param access, public or private
 * @param file, the file to upload
 * @return true on success, false on error
*/
export async function importData(
	farmId: number, fieldId: number, equId: number, datamapId: number, access: AccessibilityType, file: File, latitude?: number, longitude?: number, datetime?: Date, cropFieldId?: number
): Promise<boolean> {

	var successful: boolean = false;
	var query = '';
	if (latitude && longitude) {
		query += '?latitude=' + latitude + '&longitude=' + longitude;
		if (datetime) {
			let datetimeString = datetime.toISOString().replace(/\..+/, '').replace(/T/, ' ');
			query += '&datetime=' + datetimeString;
		}
	} else if (datetime) {
		let datetimeString = datetime.toISOString().replace(/\..+/, '').replace(/T/, ' ');
		query += '&datetime=' + datetimeString;
	}

	const form = new FormData();
	form.set('farm_id', farmId.toString())
	form.set('field_id', fieldId.toString())
	form.set('equipment_id', equId.toString())
	form.set('map_id', datamapId.toString())
	form.set('accessibility', access)
	form.append('file', file);

	await axios.post(
		apiUrl + '/observations/upload' + query,
		form,
		{
			headers: {
				'Content-Type': 'multipart/form-data',
				'Authorization': `Bearer ${getToken()}`
			},
		})
		.then(function(res) {
			// Expect statusCode 200 on successful request
			if (res.status === 200) {
				successful = true;
				return;
			}
			// No error received, but not the right statusCode
			return Promise.reject('Unexpected response received!')
		})
		.catch(async function(err) {
			if (err.status) {
				switch (err.status) {
					case 401: {
						// Token expired, refresh the token and try again
						await refreshToken();
						successful = await importData(farmId, fieldId, equId, datamapId, access, file, latitude, longitude, datetime, cropFieldId);
						break;
					}
				}
			}
		});

	return successful;
};

/**
 * getDataMaps() return array of datamap objects
 * @return array of datamap objects
*/
export async function getDataMaps(): Promise<Array<DataMap>> {
	var datamaps: Array<DataMap> = new Array(0);
	var options = getOptions('GET', apiUrl + '/datamaps');

	await Request.get(options)
	.then(function(res) {
		// Expect statusCode 200 on successful request
		if (res.statusCode === 200) {
			let response = JSON.parse(res.body);
			datamaps = response.map(DataMap.fromJSON) as Array<DataMap>;
			return;
		}
		// No error received, but not the right statusCode
		return Promise.reject('Unexpected response received!')
	})
	.catch(async function(err) {
		if (err.statusCode) {
			switch (err.statusCode) {
				case 401: {
					// Token expired, refresh the token and try again
					await refreshToken();
					datamaps = await getDataMaps();
					break;
				}
			}
		}
	});

	return datamaps;
}

/**
 * addDataMap() make an add datamap request and return boolean whether successful
 * @param datamap, a datamap object
 * @param farmId, the id of a farm (optional)
 * @return true on success, false on error
*/
export async function addDataMap(datamap: DataMap, farmId?: number): Promise<boolean> {

	// Create farmId string for request url if farm is specified
	let farmIdUrl = '';
	if (farmId) {
		farmIdUrl = '?farm_id=' + farmId;
	}
	var successful: boolean = false;
	var options = getOptions('POST', apiUrl + '/datamaps' + farmIdUrl, datamap.toJSON());

	await Request.post(options)
	.then(function(res) {
		// Expect statusCode 201 on successful request
		if (res.statusCode === 201) {
			successful = true;
			return;
		}
		// No error received, but not the right statusCode
		return Promise.reject('Unexpected response received!')
	})
	.catch(async function(err) {
		if (err.statusCode) {
			switch (err.statusCode) {
				case 401: {
					// Token expired, refresh the token and try again
					await refreshToken();
					successful = await addDataMap(datamap, farmId);
					break;
				}
			}
		}
	});

	return successful;
}
