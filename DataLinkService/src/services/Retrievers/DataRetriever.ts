import { AccessibilityType } from "../../utils/AccessibilityType";
import { LocationPoint } from "../../utils/LocationPoint";
import { setEquipmentLastRan } from "../datalinking/providers/EquipmentInformationDataProvider";
import Request from 'request-promise';
import { accessibilityTypeToString } from "../../utils/Converters/EnumConverter";
import { getAccessToken } from "../datalinking/Controllers/UserController";

//const apiUrl = 'http://proeftuin.win.tue.nl/api/v1';
const apiUrl = 'http://gateway/api/v1';

/**
 * Abstract class for all data retrievers following a standard structure
*/
export abstract class DataRetriever {

    // The id of the equipment for which to retrieve the data.
    public equipmentId: number;

    // The name of the retriever.
    public retrieverName: string;

    /**
     * Constructor to initialize a DataRetriever.
     * @param equipmentId The equipment id of for which to retrieve the data.
     * @param retrieverName The name of the retriever.
     */
    protected constructor(equipmentId: number, retrieverName: string) {
        this.equipmentId = equipmentId;
        this.retrieverName = retrieverName;
    }

    /**
     * @abstract Run the data retrieval and save the retrieved data to the database
    */
    abstract run(): void;

    /**
    * @abstract Retrieve the data retrieved after an optional date.
    */
    abstract getData(startDate?: string): void;

    /**
     * @abstract  Retrieves the last date time that the retriever was ran.
    */
    abstract async getLastSaved(): Promise<string | undefined>;

    /**
     * @abstract  Save the retrieved data to the database.
     * @param data
     * @param farmId
     * @param fieldId
     * @param cropFieldId
     * @param dataMapId
     * @param equipmentId
     * @param accessibilityType
     * @param locationPoint
     * @param dateTime
     */
    async saveData(data: string,
        farmId: number,
        fieldId: number,
        cropFieldId: number,
        dataMapId: number,
        equipmentId: number,
        accessibilityType: AccessibilityType,
        lastRan: string,
        locationPoint?: LocationPoint,
        dateTime?: Date): Promise<void> {

        // Saving Data.
        var accessToken = await getAccessToken("info@proeftuin.nl", "admin");
        var url = apiUrl + '/observations/upload?';

        if (locationPoint && locationPoint.latitude) {
            url += 'latitude=' + locationPoint.latitude + '&longitude=' + locationPoint.longitude + '&';
        }

        if (dateTime) {
            url += 'datetime' + dateTime;
        }


        var options = {
            method: 'POST',
            uri: url,
            resolveWithFullResponse: true,
            formData: {
                farm_id: farmId.toString(),
                field_id: fieldId.toString(),
                crop_field_id: cropFieldId.toString(),
                equipment_id: equipmentId.toString(),
                map_id: dataMapId.toString(),
                accessibility: accessibilityTypeToString(accessibilityType),
                file: {
                    value: data,
                    options: {
                        filename: 'data.csv',
                        contentType: 'text/csv'
                    }
                }
            },
            auth: {
                bearer: accessToken
            },
            json: true
        };

        var successful = false;
        await Request.post(options)
            .then(function (res) {
                if (res.statusCode === 200) {
                    // Successful created
                    successful = true;
                } else {
                    // Unexpected response
                    console.error(res);
                }
            })
            .catch(async function (err) {
                if (err.statusCode) {
                    switch (err.statusCode) {
                    case 401: {
                        // Token expired
                        break;
                    }
                    case 403: {
                        // User does not have permission
                        console.error('User does not have permission!');
                        break;
                    }
                    default: {
                        // Error
                        console.error(err.message);
                        break;
                    }
                    }
                } else {
                    // Error
                    console.error(err.message);
                }
            });

        if (successful) {
            // Only save after data is successfully saved.
            console.log("Data saved succesfully (%s), date:%s", this.retrieverName, lastRan);
            await setEquipmentLastRan(this.equipmentId, lastRan);
        }
    }
}