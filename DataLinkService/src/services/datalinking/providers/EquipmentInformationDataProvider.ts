import { db } from "../../../utils/DatabaseConnection";
import { EquipmentInformationEntity } from "../../../utils/EquipmentInformationEntity";

/**
 * Get the last datetime the equipment observation data was saved to the database.
 * @param equipmentId The equipment of which to retrieve the datetime.
 */
export async function getEquipmentLastRan(equipmentId: number): Promise<string | undefined> {
    var q = `SELECT * FROM dataLastSaved WHERE equipment_id = ${equipmentId} `;

    return await db.one(q,
        [],
        (d: any) => {
            return d.last_ran;
        }).catch((error: any) => {
        console.log("No previous ran date found.");
        return undefined;
    });
}

/**
 * Add the datetime the observation data of the equipment was last saved to the database.
 * @param equipmentId The id of the equipment to add to the database.
 * @param lastRan The datetime the observation data was last saved.
 */
export const addEquipmentLastRan = async (equipmentId: number, lastRan: string) => {
    const q = `INSERT INTO dataLastSaved(equipment_id, last_ran) 
                VALUES (${equipmentId}, '${lastRan}')`;
    await db.none(q).catch((error: any) => console.log(error));
};

/**
 * Set the datetime the observation data of the equipment was last saved.
 * @param equipmentId The id of the equipment to add to the database.
 * @param lastRan The datetime the observation data was last saved.
 */
export const setEquipmentLastRan = async (equipmentId: number, lastRan: string) => {
    const q = `UPDATE dataLastSaved SET last_ran= '${lastRan}'
                WHERE equipment_id = ${equipmentId}`;

    await db.one(q).catch(async (error: any) => {
        await addEquipmentLastRan(equipmentId, lastRan);
    });;
};

/**
 * Retrieve equipment ids by filter.
 * @param farmId The farm from which to retrieve the equipment ids.
 * @param fieldId The field from which to retrieve the equipment ids.
 * @param cropfieldId (Optional) The cropfield from which to retrieve the equipment ids.
 * @param saveToDatabase (Optional) Filter on whether the date is saved to the database.
 */
export async function getEquipmentIdsByFilter(farmId: number, fieldId: number, cropfieldId: number | undefined, saveToDatabase: boolean | undefined): Promise<number[]> {
    var q = `SELECT * FROM EquipmentInformation WHERE farm_id = ${farmId} AND field_id = ${fieldId} `;

    if (cropfieldId != undefined)
        q += ` AND cropfield_id = ${cropfieldId}`;

    if (saveToDatabase != undefined)
        q += ` AND savedata = ${saveToDatabase}`;
    console.log(q);
    var ids: number[] = [];

    await db.each(q, [],
        (d: any) => {
            ids.push(d.equipment_id);
        }).catch((error: any) => { console.log(`getEquipmentIdsByFilter error: ${error}`); });

    return ids;
};

/**
 * Retrieve equipment ids for which the data is save to the database.
 * @param saveToDatabase Filter on whether the date is saved to the database.
 */
export async function getEquipmentIdsSaveData(saveToDatabase: boolean): Promise<number[]> {
    var q = `SELECT * FROM EquipmentInformation WHERE savedata = ${saveToDatabase}`;

    var ids: number[] = [];

    await db.each(q, [],
        (d: any) => {
            ids.push(d.equipment_id);
        }).catch((error: any) => { console.log(`Cannot get Equipmentids that have to be saved to the database: ${error}`); });

    return ids;
};

/**
 * Adds location information to the database
 * @param location The location information to insert into the SQL table.
 */
export async function postLocationInformation(location: any) {
    var q = `INSERT INTO EquipmentInformation
                (farm_id, field_id, equipment_id, savedata) 
                VALUES( ${location.farm_id},
                        ${location.field_id},
                        ${location.equipment_id},
                        ${location.savedata})`;

    if (location.cropfield_id)
        q = `INSERT INTO EquipmentInformation
                (farm_id, field_id, cropfield_id, equipment_id, savedata) 
                VALUES( ${location.farm_id},
                        ${location.field_id},
                        ${location.cropfield_id},
                        ${location.equipment_id},
                        ${location.savedata})`;




    await db.none(q);
};

/**
 * Retrieve location information of a certain equipment.
 * @param id The id of the equipment.
 */
export const getLocationInformationByEquipmentId = async (id: number): Promise<EquipmentInformationEntity> => {
    const q = `SELECT * FROM EquipmentInformation WHERE equipment_id = ${id}`;
    return await db.one(q, [],
        (d: any) => {
            return new EquipmentInformationEntity(d.farm_id, d.field_id, d.cropfield_id, d.equipment_id, d.savedata);
        }).catch((error: any) => { console.log(`error: ${error}`); });
};

/**
 * Update location information in the database
 * @param location The location information to insert into the SQL table.
 */
export const updateLocationInformationByEquipmentId = async (equipmentId: number, location: any) => {
    var q =
        `UPDATE EquipmentInformation SET 
                farm_id = ${location.farm_id},
                field_id = ${location.field_id},
                cropfield_id = null,
                savedata = ${location.savedata} 
            WHERE equipment_id = ${equipmentId}`;

    if (location.cropfield_id) {
        q =
            `UPDATE EquipmentInformation SET 
                farm_id = ${location.farm_id},
                field_id = ${location.field_id},
                cropfield_id = ${location.cropfield_id},
                savedata = ${location.savedata} 
            WHERE equipment_id = ${equipmentId}`;
    }

    await db.none(q);
};

/**
 * Delete location information for a certain equipment.
 * @param id The id of the equipment to delete the location information from.
 */
export const deleteLocationInformationByEquipmentId = async (id: number) => {
    const q = `DELETE FROM EquipmentInformation WHERE equipment_id = ${id}`;
    await db.none(q).catch((error: any) => { console.log(`error: ${error}`); });
};

