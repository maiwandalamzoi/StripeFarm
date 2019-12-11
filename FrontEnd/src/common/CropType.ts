/**
 * The CropField class can be instanciated to create a cropfield.
 * It shows which variables a cropField has, and which functies the class provides.
 * @param id: The id of a cropType
 * @param name: The name of a cropType
 * @param variety: the variety of a cropType
*/
export class CropType {
    id: number;
    name: string;
    variety: string;
    /*
    consturctor(): The constructor is used to set the variables once this class is instanciated.
    */
    constructor(id: number|undefined, name: string, variety: string) {
        this.id = id || -1;
        this.name = name;
        this.variety = variety;
    }

    /*
    toJSON(): this function tries to transform the cropField object into a JSON object.
    */
    toJSON() {
        return {
            name: this.name,
            variety: this.variety
        }
    }
    /*
    fromJSON(): this function tries to transform a JSON object into the current object.
    */
    static fromJSON(json: CropTypeJSON): CropType {
        let field = Object.create(CropType.prototype);
        return Object.assign(field, json);
    }
}

// A representation of Field's data that can be converted to
// and from JSON without being altered.
export interface CropTypeJSON {
    id: number;
    name: string;
    variety: string;
}
