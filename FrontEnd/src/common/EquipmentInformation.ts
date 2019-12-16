/**
 * The equipement information class can be instanciated to create an equipment information object.
 * It shows which variables with additional equipemnt information.
 * @param farmId
 * @param fieldId
 * @param cropfieldId
 * @param equipmentId
 * @param savedata
 */

 export class EquipmentInformation {
     farmId: number;
     fieldId: number;
     cropfieldId: number | undefined;
     equipmentId: number;
     savedata: boolean;

     /**
     * consturctor(): The constructor is used to set the variables once this class is instanciated.
     */
    constructor(farmId: number, fieldId: number, cropfieldId: number | undefined, equipmentId: number, savedata: boolean) {
        this.farmId = farmId;
        this.fieldId = fieldId;
        this.cropfieldId = cropfieldId;
        this.equipmentId = equipmentId;
        this.savedata = savedata;
    }
       /**
     * toJSON(): this function tries to transform the current object into a JSON object
     */
    toJSON() {
        return {
            farm_id: this.farmId,
            field_id: this.fieldId,
            cropfield_id: this.cropfieldId,
            equipment_id: this.equipmentId,
            savedata: this.savedata
        }
    }
    static fromJSON(json: equipmentInfoJSON): EquipmentInformation {
        let equipmentInfo = Object.create(EquipmentInformation.prototype);
        return Object.assign(equipmentInfo, {
            farmId: json.farmId,
            fieldId: json.fieldId,
            cropfieldId: json.cropfieldId,
            equipmentId: json.equipmentId,
            savedata: json.saveData
        });
    }
}
/**
 * This interface represent equipmentJSON object.
 */
interface equipmentInfoJSON {
    farmId: number;
    fieldId: number;
    cropfieldId: number;
    equipmentId: number;
    saveData: boolean;
}