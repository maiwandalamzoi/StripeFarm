/**
 * The equipment model class can be instanciated to create an equipment model.
 * It shows which variables a cropField has, and which functies the class provides.
 * @param id: this is the id of the equipment model
 * @param brand_name: this is the name of the brand the equipment model has.
 * @param model: this is the model of the equipment model
 * @param model_year: this is the year of the equipment model.
 * @param series: this is the series of the model.
 * @param software_version: this is the software version of the equipment model.
 * @param description: this is the description of the equipment model.
 * @param slug: this exists, and is a problem
 */
export class EquipmentModel {

    id: number|undefined;
    brand_name: string;
    model: string;
    model_year: number|undefined;
    series: string|undefined;
    software_version: string|undefined;
    description:string|undefined;
    slug: string | undefined;

    /**
     * consturctor(): The constructor is used to set the variables once this class is instanciated.
     */
    constructor(brand_name: string, model: string, model_year: number|undefined, series: string|undefined, software_version: string|undefined, description:string|undefined, slug: string|undefined, id: number|undefined) {
        this.brand_name = brand_name;
        this.model = model;
        this.model_year = model_year;
        this.series = series;
        this.software_version = software_version;
        this.description = description;
        this.slug = slug;
        this.id = id;
    }
    // toJSON is automatically used by JSON.stringify
    toJSON() {
        return {
            brand_name: this.brand_name,
            model: this.model,
            model_year: this.model_year,
            series: this.series,
            software_version: this.software_version,
            description: this.description,
            slug: this.slug
        }
    }

    // fromJSON is used to convert an serialized version
    // of the Field to an instance of the class
    static fromJSON(json: equipmentModelJSON): EquipmentModel {

        // create an instance of the Field class
        let field = Object.create(EquipmentModel.prototype);
        // copy all the fields from the json object
        return Object.assign(field, {
            id: json.id,
            brand_name: json.brand_name,
            model: json.model,
            model_year: json.model_year,
            series: json.series,
            software_version: json.software_version,
            description: json.description,
            slug: json.slug
        });

    }
}

// A representation of Field's data that can be converted to
// and from JSON without being altered.
interface equipmentModelJSON {
    id: number;
    brand_name: string;
    model: string;
    model_year: number;
    series: string;
    software_version: string;
    description:string;
    slug: string;
}
