import { SoilType, SoilTypeJSON } from "./SoilType";
import { LocationPoint, LocationPointJSON } from "./LocationPoint";
import { AccessibilityType } from "./AccessibilityType";
/**
 * The CropField class can be instanciated to create a cropfield.
 * It shows which variables a cropField has, and which functies the class provides.
 * @param id: this is the id of the field.
 * @param soil_type: this tis the soil type of the field.
 * @param field_name: this is the name of the field.
 * @param coordinates: these are the coordinates of the field.
 * @param size_in_hectare: this is the size of the field in hectare.
 * @param accessibility: Whether the accessibiility of the field is private or public
 */
export class Field {
    id: number;
    soil_type: SoilType;
    field_name: string;
    coordinates: LocationPoint[];
    size_in_hectare: number;
    accessibility: AccessibilityType;
    /**
     * consturctor(): The constructor is used to set the variables once this class is instanciated.
     */
    constructor(id: number|undefined, fieldName: string, coordinates: LocationPoint[], sizeInHectare: number, soilType: SoilType, accessibility: AccessibilityType) {
        this.id = id || -1;
        this.field_name = fieldName;
        this.coordinates = coordinates;
        this.soil_type = soilType;
        this.size_in_hectare = sizeInHectare;
        this.accessibility = accessibility;
    }
    /**
     * toJSON(): this function tries to transform the current object into a JSON object
     */
    toJSON() {
        return {
            field_name: this.field_name,
            coordinates: this.coordinates.map(coordinate => coordinate.toJSON()),
            size_in_hectare: this.size_in_hectare,
            soil_type_id: this.soil_type.id,
            accessibility: this.accessibility
        }
    }
    /**
     * fromJSON(): this function tries to transform a JSON object into the current object.
     */
    static fromJSON(json: FieldJSON): Field {
        let field = Object.create(Field.prototype);
        return Object.assign(field, json, {
            soil_type: SoilType.fromJSON(json.soil_type),
            coordinates: json.coordinates.map(coordinate => LocationPoint.fromJSON(coordinate))
        });
    }
}
/**
 * This interface represent fieldJSON object.
 */
interface FieldJSON {
    id: number;
    soil_type: SoilTypeJSON;
    field_name: string;
    coordinates: LocationPointJSON[];
    size_in_hectare: number;
    accessibility: string;
}
