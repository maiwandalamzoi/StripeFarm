import { DataColumn, DataColumnJSON } from "./DataColumn";
import { AccessibilityType } from "./AccessibilityType";
/**
 * The dataMap class can be instanciated to create a data map.
 * It shows which variables a data map has, and which functies the class provides.
 * @param id: the id of the data map
 * @param name: the name of the data map
 * @param description: the description of the data map
 * @param has_header: whether the data map has headers
 * @param has_coordinate: whether the dat map has coordintates
 * @param has_date: whether the data map has a date.
 * @param has_time: whether the data map has a teme.
 * @param model_id: the id of the model this data map belongs to
 * @param accessibility: whether the access to this farm is private or public
 * @param maps:the object that tells which column belongs to which type of data.
*/
export class DataMap {
    id: number;
    name: string;
    description: string;
    has_header: boolean;
    has_coordinate: boolean;
    has_date: boolean;
    has_time: boolean;
    model_id: number;
    accessibility: AccessibilityType;
    maps: DataColumn[];
    /*
    consturctor(): The constructor is used to set the variables once this class is instanciated.
    */
    constructor (
        name: string,
        description: string,
        has_header: boolean = false,
        has_coordinate: boolean = false,
        has_date: boolean = false,
        has_time: boolean = false,
        model_id: number,
        accessibility: AccessibilityType,
        maps: DataColumn[]
    ) {
        this.id = -1;
        this.name = name;
        this.description = description;
        this.has_header = has_header
        this.has_time = has_time;
        this.has_coordinate = has_coordinate;
        this.has_date = has_date;
        this.model_id = model_id;
        this.accessibility = accessibility;
        this.maps = maps;
    }
    /*
    toJSON(): this function tries to transform the current object into a JSON object
    */
    toJSON() {
        return {
            name: this.name,
            description: this.description,
            has_header: this.has_header,
            has_coordinate: this.has_coordinate,
            has_date: this.has_date,
            has_time: this.has_time,
            model_id: this.model_id,
            accessibility: this.accessibility,
            maps: this.maps.map(dataColumn => dataColumn.toJSON())
        }
    }
    /*
    fromJSON(): this function tries to transform a JSON object into the current object.
    */
    static fromJSON(json: DataMapJSON ): DataMap {
        let datamap = Object.create(DataMap.prototype);
        return Object.assign(datamap, json, {
            maps: json.maps.map(dataColumn => DataColumn.fromJSON(dataColumn))
        });
    }
}
/*
This interface represent a dtatMapJSON object.
*/
interface DataMapJSON {
    id: number;
    name: string;
    description: string;
    has_header: boolean;
    has_coordinate: boolean;
    has_date: boolean;
    has_time: boolean;
    model_id: number;
    accessibility: AccessibilityType;
    maps: DataColumnJSON[];
}
