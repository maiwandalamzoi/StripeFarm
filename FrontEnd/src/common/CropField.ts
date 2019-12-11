import { LocationPoint, LocationPointJSON } from "./LocationPoint";
import { CropType, CropTypeJSON } from "./CropType";
import { AccessibilityType } from "./AccessibilityType";

/**
 * The CropField class can be instanciated to create a cropfield.
 * It shows which variables a cropField has, and which functies the class provides.
 * @param id: the id of a cropfield.
 * @param farm_id: The id of the farm this crop field belongs to.
 * @param field_id: the id of the field this crop field belongs to.
 * @param name: the name of the crop field.
 * @param period_start: the date the cropfield started.
 * @param period_end: the date the cropfield ended.
 * @param coordinates: the coordinates of the location of the cropfield.
 * @param crop_type: the crop type of the crop field.
 * @param accessibility: whether the cropfield is private or public.
*/
export class CropField{
    id: number;
    farm_id: number;
    field_id: number;
    name: string;
    period_start: Date;
    period_end: Date;
    coordinates: LocationPoint[];
    crop_type: CropType;
    accessibility: AccessibilityType;
    /*
    consturctor(): The constructor is used to set the variables once this class is instanciated.
    */
    constructor(id: number|undefined, farm_id: number|undefined, field_id: number|undefined, name:string, period_start:Date, period_end:Date, coordinates:LocationPoint[], crop_type:CropType, accessibility: AccessibilityType){
        this.id = id || -1;
        this.farm_id = farm_id || -1;
        this.field_id = field_id || -1;
        this.name = name;
        this.period_start = period_start;
        this.period_end = period_end;
        this.coordinates = coordinates;
        this.crop_type = crop_type;
        this.accessibility = accessibility;
    }
    /*
    toJSON(): this function tries to transform current object into a JSON object
    */
    toJSON() {
        return {
            name: this.name,
            period_start: this.period_start.toDateString(),
            period_end: this.period_end.toDateString(),
            coordinates: this.coordinates.map(coordinate => coordinate.toJSON()),
            accessibility: this.accessibility,
            crop_type_id: this.crop_type.id
        }
    }
    /*
    toTableRow(): this function transforms the cropField into a format that can be used to create the row of a table.
    */
    public toTableRow() {
        return {
            name: this.name,
            period_start: this.period_start.getDate() + "-" + this.period_start.getMonth() + "-" + this.period_start.getFullYear(),
            period_end: this.period_end.getDate() + "-" + this.period_end.getMonth() + "-" + this.period_end.getFullYear(),
            crop_name: this.crop_type.name,
            crop_variety: this.crop_type.variety
        }
    }
    /*
    fromJSON(): this function tries to transform a JSON object into the current object.
    */
    static fromJSON(json: cropFieldJSON): CropField {
        let field = Object.create(CropField.prototype);
        return Object.assign(field, json, {
            period_start: new Date(json.period_start),
            period_end: new Date(json.period_end),
            coordinates: json.coordinates.map(coordinate => LocationPoint.fromJSON(coordinate)),
            crop_type: CropType.fromJSON(json.crop_type),
        });

    }
}
/*
This interface represent cropFieldJSON object.
*/
interface cropFieldJSON {
    id: number;
    farm_id: number;
    field_id: number;
    name: string;
    period_start: string;
    period_end: string;
    coordinates: LocationPointJSON[];
    crop_type: CropTypeJSON;
    accessibility: string;
}
