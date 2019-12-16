import { LiveDataRetriever } from "./LiveDataRetriever";
import { DataValue } from "../../utils/DataValue";
import { DataColumn } from "../../utils/DataColumn";
import { IDataConverter } from "../../utils/Converters/IDataConverter";
import { WolkyTolkyDataConverter } from "../../utils/Converters/WolkyTolkyDataConverter";
import { getDataColumnsByEquipmentModelId, getEquipmentModelId } from "../datalinking/Controllers/MappingController";
import { getAccessToken } from "../datalinking/Controllers/UserController";
import { getLocationInformationByEquipmentId } from
    "../datalinking/providers/EquipmentInformationDataProvider";
import Request from 'request-promise';

const apIurl = "https://extern.wolkytolky.com/v1.1/";
const request = require("request-promise");
const dataConverter: IDataConverter = new WolkyTolkyDataConverter();

/**
 * Class that retrieves the latest observation data from Wolky Tolky equipment.
 */
export class WolkyTolkyLiveDataRetriever extends LiveDataRetriever{

    // The station id of the WolkyTolky equipment for which to retrieve the data.
    stationId: number;

    // The api key of the equipment for which to retrieve the data.
    apiKey: string;

    /**
    * Constructor to initialize a WolkyTolkyDataRetriever.
    * @param stationId The station id of the WolkyTolky equipment for which to retrieve the data.
    * @param apiKey The api key of the equipment for which to retrieve the data.
    * @param equipmentId The id of the equipment for which to retrieve the latest observation data.
    */
    constructor(stationId: number, apiKey: string, equipmentId: number) {
        super(equipmentId);
        this.stationId = stationId;
        this.apiKey = apiKey;
    }

    /**
     * Get the latest observation data from the WolkyTolky equipment.
     */  
    async getLatestData(): Promise<DataValue[]> {
        const url = apIurl + `stationdata/?apiKey=${this.apiKey}&stationId=${this.stationId}&type=json`;
        const options = {
            method: "GET",
            uri: url,
            resolveWithFullResponse: true,
        };
        var response = '';
        await Request.get(options)
            .then(function (res) {
                response = res.body;
            })
            .catch(async function (err) {
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
        
        
        var accessToken = await getAccessToken("info@proeftuin.nl", "admin");

        // Get the location information information of the equipment.
        const locationInformation = await getLocationInformationByEquipmentId(this.equipmentId);
        // Get the equipment model id of this retriever.
        var equipmentModelId: number = await getEquipmentModelId(this.equipmentId, accessToken, locationInformation.farmId);

        // Find the datacolumns for this equipment to add meta data.
        var dataColumns: DataColumn[] = await getDataColumnsByEquipmentModelId(equipmentModelId, accessToken);

        return dataConverter.transformLiveData(response, dataColumns);
    }

}