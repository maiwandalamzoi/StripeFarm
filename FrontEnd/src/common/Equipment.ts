import { AccessibilityType } from "./AccessibilityType";
/**
 * The equipement class can be instanciated to create an equipment object.
 * It shows which variables equipemnt has, and which functies the class provides.
 * @param id: this is the id of the equipment
 * @param name: this is the name of the equipment
 * @param description: this is the description of the equipment
 * @param model_id: this si the id of the model that the equipment is coupled with.
 * @param manufacturing_date: this is the date on which the equipment was manufactured.
 * @param serial_number: this is the serial number of the equipment.
 * @param accessibility: whether the access to this equipment is private or public.
 */
export class Equipment {

    id: number|undefined;
    name: string;
    description: string | undefined;
    model_id: number | undefined;
    manufacturing_date: string | undefined;
    serial_number: string | undefined;
    accessibility: AccessibilityType;
    field_name: string | undefined;
    cropfield_name: string | undefined;
    /**
     * consturctor(): The constructor is used to set the variables once this class is instanciated.
     */
    constructor(name: string, description: string | undefined, model_id: number | undefined, manufacturing_date: string | undefined, serialnumber: string | undefined, accessibility: AccessibilityType, id: number|undefined) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.model_id = model_id;
        this.manufacturing_date = manufacturing_date;
        this.serial_number = serialnumber;
        this.accessibility = accessibility;
    }
    /**
     * toJSON(): this function tries to transform the current object into a JSON object
     */
    toJSON() {
        return {
            name: this.name,
            description: this.description,
            model_id: this.model_id,
            manufacturing_date: this.manufacturing_date,
            serial_number: this.serial_number,
            accessibility: this.accessibility
        }
    }
    /**
     * fromJSON(): this function tries to transform a JSON object into the current object.
     */
    static fromJSON(json: equipmentJSON): Equipment {
        let equipment = Object.create(Equipment.prototype);
        return Object.assign(equipment, json);
    }
}
/**
 * This interface represent equipmentJSON object.
 */
interface equipmentJSON {
    id: number;
    name: string;
    description: string;
    model_id: string;
    manufacturing_date: string;
    serial_number: string;
    accessibility: string;
}
