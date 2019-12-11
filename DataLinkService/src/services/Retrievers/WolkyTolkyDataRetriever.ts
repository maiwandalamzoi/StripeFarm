import { DataRetriever } from "./DataRetriever";
import { getEquipmentModelId, getDataMapIdByEquipmentModelId } from "../datalinking/Controllers/MappingController";
import { getWolkyTolkyStationGps as getWolkyTolkyStationGPS } from "../datalinking/providers/WolkyTolkyDataProvider";
import { AccessibilityType } from "../../utils/AccessibilityType";
import { getLocationInformationByEquipmentId, getEquipmentLastRan } from
    "../datalinking/providers/EquipmentInformationDataProvider";
import { getAccessToken } from "../datalinking/Controllers/UserController";
import Request from 'request-promise';

const apIurl = "https://extern.wolkytolky.com/v1.1/";
const dotenv = require("dotenv");

/**
 * Class that retrieves and saves all data for the WolkyTolky sensors.
 */
export class WolkyTolkyDataRetriever extends DataRetriever {

    // The station id of the WolkyTolky equipment for which to retrieve the data.
    private stationId: number;

    // The api key of the equipment for which to retrieve the data.
    private apiKey: string;

    /**
     * Constructor to initialize a WolkyTolkyDataRetriever.
     * @param stationId The station id of the WolkyTolky equipment for which to retrieve the data.
     * @param apiKey The api key of the equipment for which to retrieve the data.
     * @param equipmentId The equipment id of for which to retrieve the data.
     */
    constructor(stationId: number, apiKey: string, equipmentId: number, retrieverName: string) {
        super(equipmentId, retrieverName);
        this.stationId = stationId;
        this.apiKey = apiKey;
    }

    /**
    * Get the last date the data was saved to the database.
    */
    async getLastSaved(): Promise<string | undefined> {
        return await getEquipmentLastRan(this.equipmentId);
    }

    /**
    * Retrieves the last date time that the retriever was ran.
    */
    async run(): Promise<void> {
        const lastRan = await this.getLastSaved();

        const data = await this.getData(lastRan);

        var accessToken = await getAccessToken("info@proeftuin.nl", "admin");

        var locationInformation = await getLocationInformationByEquipmentId(this.equipmentId);
        var equipmentModelId = await getEquipmentModelId(this.equipmentId, accessToken, locationInformation.farmId);

        try {
            var dataMapId = await getDataMapIdByEquipmentModelId(equipmentModelId, accessToken);
        }
        catch (error) {
            console.log("No datamap found");
            return;
        }

        // Get the most recent location of the station.
        const locations = await getWolkyTolkyStationGPS(this.apiKey, this.stationId);
        const latestLocation = locations[0];


        var latestDate = await this.getLatestDataDate();

        // Save the data to the database.
        await this.saveData(data,
            locationInformation.farmId,
            locationInformation.fieldId,
            locationInformation.cropfieldId,
            dataMapId,
            equipmentModelId,
            AccessibilityType.Public,
            latestDate,
            latestLocation);
    }

    /**
     * Get all the WolkyTolky api data after a certain date as a csv type.
     * @param startDate The date after which to retrieve the data
     */
    async getData(
            startDate?: string):
        Promise<any> {

        let url = apIurl + `stationdata/?stationId=${this.stationId}&apiKey=${this.apiKey}&type=csv`;

        if (startDate)
            url += `&startDate=${startDate}`;

        const options = {
            method: "GET",
            uri: url,
            resolveWithFullResponse: true,
            json: true
        };
        return await Request.get(options)
            .then(function(res) {
                return res.body;
            })
            .catch(async function(err) {
                if (err.statusCode) {
                    switch (err.statusCode) {
                    case 401:
                    {
                        // User does not have permission
                        console.error("Not allowed to access data from WolkyTolky");
                        break;
                    }
                    default:
                    {
                        // Error
                        console.error(err.message);
                        throw Error("Could not fetch!");
                    }
                    }
                } else {
                    // Error
                    console.error(err.message);
                    throw Error("Unexpected response received!");
                }
            });
    }

    /**
     * Returns the latest datetime as string from the WolkyTolky data
     */
    async getLatestDataDate(): Promise<string> {
        const url = apIurl + `stationdata/?stationId=${this.stationId}&apiKey=${this.apiKey}&type=json`;

        const options = {
            method: "GET",
            uri: url,
            resolveWithFullResponse: true,
            json: true
        };
        var response = '';
        await Request.get(options)
            .then(function(res) {
                response = res.body;
            })
            .catch(async function(err) {
                if (err.statusCode) {
                    switch (err.statusCode) {
                    case 401:
                    {
                        // User does not have permission
                        console.error("Not allowed to access data from WolkyTolky");

                        break;
                    }
                    default:
                    {
                        // Error
                        console.error(err.message);
                        throw Error("Could not fetch!");
                    }
                    }
                } else {
                    // Error
                    console.error(err.message);
                    throw Error("Unexpected response received!");
                }
            });

        const stringArray = JSON.parse(response) as Array<string>;
        stringArray.splice(0, 1);

        if (stringArray.length <= 1)
            return "";

        var latestData = stringArray[stringArray.length - 2].valueOf().toString();
        var dataRowValues = latestData.split(";");
        console.log(dataRowValues[0]);

        // The first column contains the date time of the observation.
        // Append one second, so not the same data gets saved twice.
        var latestDate = dataRowValues[0] + ":01";
        return latestDate;
    }
}