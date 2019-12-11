/**
 * The user class can be instanciated to create a WolkyTolkyEquipment.
 * It shows which variables WolkyTolkyEquipment has, and which functies the class provides.
 * @param equipmentId: this is the id of the WolkyTolkyEquipment.
 * @param stationId: this is the stationId.
 * @param apiKey: this is the api key of WolkyTolky.
 */
 export class WolkyTolkyEq {
    equipmentId: number;
    stationId: number;
    apiKey: string;
    /**
     * consturctor(): The constructor is used to set the variables once this class is instanciated.
     */
    constructor(eqId: number, stationId: number, apiKey: string) {
        this.equipmentId = eqId;
        this.stationId = stationId;
        this.apiKey = apiKey;
    }
    /**
     * toJSON(): this function tries to transform the current object into a JSON object
     */
    toJSON() {
        return {
            equipment_id: this.equipmentId,
            station_id: this.stationId,
            api_key: this.apiKey
        }
    }

    /**
     * fromJSON(): this function tries to transform a JSON object into the current object.
     */
    static fromJSON(json: wolkyTolkyEqJSON): WolkyTolkyEq {
        let wolkyTolkyEq = Object.create(WolkyTolkyEq.prototype);
        return Object.assign(wolkyTolkyEq, json);
    }
}
/**
 * This interface represent wolkytolkyEqJSON object.
 */
interface wolkyTolkyEqJSON {
    equipmentId: number;
    stationId: number;
    apiKey: string;
}
