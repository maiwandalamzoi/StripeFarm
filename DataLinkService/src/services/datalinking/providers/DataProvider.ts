import { DataValue } from "../../../utils/DataValue";
import { LiveDataRetriever } from "../../Retrievers/LiveDataRetriever";
import { WolkyTolkyLiveDataRetriever} from
    "../../Retrievers/WolkyTolkyLiveDataRetriever";
import { getEquipmentIdsByFilter } from "./EquipmentInformationDataProvider";
import { getWolkyTolkyEqByEquipmentId } from "./WolkyTolkyDataProvider";
import { WolkyTolkyEqEntity } from "../../../utils/WolkyTolkyEqEntity";

/**
 * Get all the data from the sensors corresponding with the farm, field and cropfield id.
 * @param farmId The farm from which to retrieve the data.
 * @param fieldId The field from which to retrieve the data.
 * @param cropfieldId The cropfield from which to retrieve the data.
 */ 
export async function getLiveDataByFilter(farmId: number, fieldId: number, cropfieldId?: number) : Promise<DataValue[]> {
    var liveDataRetrievers: LiveDataRetriever[] = [];

    // Get all the equipments that are in the specified location.
    var equipmentIds = await getEquipmentIdsByFilter(farmId, fieldId, cropfieldId, undefined);
    console.log(equipmentIds);
    // Add all the live data from the WolkyTolky equipments.
    var wolkyTolkyEquipments: WolkyTolkyEqEntity[] = [];
    for (var ids of equipmentIds) {
        var eq = await getWolkyTolkyEqByEquipmentId(ids);
        if(eq)
            wolkyTolkyEquipments.push(eq);
    }

    for (var equipments of wolkyTolkyEquipments) {
        liveDataRetrievers.push(new WolkyTolkyLiveDataRetriever(equipments.stationId, equipments.apiKey, equipments.equipmentId));
    }

    console.log(liveDataRetrievers);

    // More sensors could be added here and should be added to the liveDataRetrievers list.

    var liveData : DataValue[] = [];
    var i = 0;
    for (var dataRetriever of liveDataRetrievers) {
        i++;
        console.log("DataRetriever running: " + dataRetriever.equipmentId + " - "+ i);
        var data = await dataRetriever.getLatestData();
        liveData = liveData.concat(data);
    }

    return liveData;
}
