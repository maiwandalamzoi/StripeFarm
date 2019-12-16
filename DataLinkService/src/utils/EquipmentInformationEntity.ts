/**
 * Entity opbject for Equipment information
 */
export class EquipmentInformationEntity {

    // The id of the farm the equipment is located on.
    farmId: number;

    // The id of the field the equipment is located on.
    fieldId: number;

    // The id of the crop field the equipment is located on.
    cropfieldId: number;

    // The id of the equipment to which this information is related.
    equipmentId: number;

    // Value whether to save the data to the database.
    saveData: boolean;

    /**
     * Constructor for [[EquipmentInformationEntity]]
     * @param farmId The id of the farm the equipment is located on.
     * @param fieldId The id of the field the equipment is located on.
     * @param cropfieldId The id of the crop field the equipment is located on.
     * @param equipmentId The id of the equipment to which this information is related.
     * @param saveData Value whether to save the data to the database.
     */
    constructor(farmId: number,
        fieldId: number,
        cropfieldId: number,
        equipmentId: number,
        saveData: boolean) {

        this.farmId = farmId;
        this.fieldId = fieldId;
        this.cropfieldId = cropfieldId;
        this.equipmentId = equipmentId;
        this.saveData = saveData;
    }
}