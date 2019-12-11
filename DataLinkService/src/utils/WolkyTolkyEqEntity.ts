/**
 * Entity object of a Wolky Tolky Equipment.
 */
export class WolkyTolkyEqEntity {

    // The id of the entity
    id: number;

    // The api key of Wolky Tolky.
    apiKey: string;

    // The station id of the equipment.
    stationId: number;

    // The id of the equipment this Wolky Tolky equipment belongs to.
    equipmentId: number;

    /**
     * @constructor Constructor for a Wolky Tolky entity.
     * @param apiKey The api key of Wolky Tolky.
     * @param stationId The station id of the equipment.
     * @param id The id of the entity
     */
    constructor(apiKey: string, stationId: number, id: number, equipmentId: number){
        this.apiKey = apiKey;
        this.stationId = stationId;
        this.id = id;
        this.equipmentId = equipmentId; 
    }
}