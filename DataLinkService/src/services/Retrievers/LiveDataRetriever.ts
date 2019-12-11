import { DataValue } from "../../utils/DataValue";

/**
 * Abstract class for retrieving the latest observation data.
 */
export abstract class LiveDataRetriever {

    // The id of the equipment for which to retrieve the latest observation data.
    equipmentId: number;

    /**
     * @constructor Constructs a [[LiveDataRetriever]].
     * @param equipmentId The id of the equipment for which to retrieve the latest observation data.
     */
    constructor(equipmentId: number) {
        this.equipmentId = equipmentId;
    }

    /**
     * Retrieve all the latest observation data.
     */
    abstract async getLatestData(): Promise<DataValue[]>;
}