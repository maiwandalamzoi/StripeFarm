/* This class contains the function that return values upon API requests. Hence will
 * return JSON values. That can be used in the backend.
 */
import { db } from "../../../utils/DatabaseConnection";
import { Request } from "express";
import { IDataConverter } from "../../../utils/Converters/IDataConverter";
import { WolkyTolkyDataConverter } from "../../../utils/Converters/WolkyTolkyDataConverter";
import { LocationPoint } from "../../../utils/LocationPoint";
import { deleteLocationInformationByEquipmentId } from "./EquipmentInformationDataProvider";
import { WolkyTolkyEqEntity } from "../../../utils/WolkyTolkyEqEntity";
const request = require("request-promise");
const dotenv = require("dotenv");
const APIurl = "https://extern.wolkytolky.com/v1.1/";
dotenv.config();

const dataConverter: IDataConverter = new WolkyTolkyDataConverter();


/**
 * Retrieve a list of WolkyTolky equipments from the database.
 */
export const getEquipmentsWt = async () => {
    const q = "SELECT * FROM WolkyTolkyEquipment";
    var result: WolkyTolkyEqEntity[] = [];
    await db.each(q, [],
        (d: any) => {
            var equipment = new WolkyTolkyEqEntity(d.api_key, d.station_id, d.id, d.equipment_id);
            result.push(equipment);
        }).catch((error: any) => { console.log(`error: ${error}`); });

    return result;
};

/**
 * Adds WolkyTolky equipment to the database.
 * @param req The request to insert into the SQL table.
 */
export const postWolkyTolkyEquipment = async (equipment: any) => {
    const q = `INSERT INTO WolkyTolkyEquipment(api_key, station_id, equipment_id) 
                VALUES ('${equipment.api_key}', ${equipment.station_id}, ${equipment.equipment_id})`;

    await db.none(q);
};

/**
 * Retrieve a WolkyTolky equipment from the database based on its id.
 * @param id The id of the WolkyTolky equipment.
 */
export const getEquipmentsWtById = async (id: number): Promise<WolkyTolkyEqEntity> => {
    const q = `SELECT * FROM WolkyTolkyEquipment WHERE equipment_id = ${id}`;

    return await db.one(q,[],
        (d: any) => {
            return new WolkyTolkyEqEntity(d.api_key, d.station_id, d.id, d.equipmentId);
        }).catch((error: any) => { console.log(`error: ${error}`); });
};

/**
 * Retrieve a WolkyTolky equipment from the database based on an equipment id.
 * @param id The id of the equipment.
 */
export const getWolkyTolkyEqByEquipmentId = async (id: number): Promise<WolkyTolkyEqEntity> => {
    const q = `SELECT * FROM WolkyTolkyEquipment WHERE equipment_id = ${id}`;
    return await db.one(q,[],
        (d: any) => {
            return new WolkyTolkyEqEntity(d.api_key, d.station_id, d.id, d.equipment_id);
        }).catch((error: any) => { console.log(`This equipment is not of type WolkyTolky`); });
};

/**
 * Update a Wolky Tolky equipment in the database.
 * @param id The id of the equipment to update.
 * @param equipment The new equipment information to put in the database
 */
export const updateWolkyTolkyEquipment = async (equipment: any) => {
    const q = `UPDATE WolkyTolkyEquipment SET
                api_key = '${equipment.api_key}', 
                station_id = ${equipment.station_id}
            WHERE equipment_id = ${equipment.equipment_id}`;

    await db.none(q).catch((error: any) => { console.log(`Updating WolkyTolky equipment error: ${error}`); });
};

/**
 * Delete WolkyTolky equipment from the database given its id.
 * @param id The id of the equipment to delete.
 */
export const deleteEquipmentsWtById = async (id: number) => {
    const d = `DELETE FROM WolkyTolkyEquipment where equipment_id = ${id}`;
    await db.none(d).catch((error: any) => { console.log(`error: ${error}`); });
};

/**
 *  Gets the recorded locations of the WolkyTolky station
 * @param apiKey the api of the WolkyTolky equipment.
 * @param stationId the station id of the WolkyTolky equipment.
 */
export async function getWolkyTolkyStationGps(apiKey: string, stationId: number): Promise<LocationPoint[]> {
    const url = APIurl + `stationlocations/?apiKey=${apiKey}&stationId=${stationId}&type=json`;
    const response = await request(url);
    return dataConverter.transformLocationData(response);
};