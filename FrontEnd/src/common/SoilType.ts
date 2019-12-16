/**
 * The soilType class can be instanciated to create a soilType.
 * It shows which variables a soilType has, and which functies the class provides.
 * @param id: this is the id of the soil type.
 * @param name: this is the name of they soil type.
 * @param description: this is the description of the soil type.
 */
export class SoilType {
    id: number;
    name: string;
    description: string;
    /**
     * consturctor(): The constructor is used to set the variables once this class is instanciated.
     */
    constructor(id: number|undefined, name: string, description: string) {
        this.id = id || -1;
        this.name = name;
        this.description = description;
    }
    /**
     * fromJSON(): this function tries to transform a JSON object into the current object.
     */
    static fromJSON(json: SoilTypeJSON): SoilType {
        let field = Object.create(SoilType.prototype);
        return Object.assign(field, json);
    }

}
/**
 * This interface represent soilTypeJSON object.
 */
export interface SoilTypeJSON {
    id: string;
    name: string;
    description: string;
}
