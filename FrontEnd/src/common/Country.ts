/**
 * This class can be instanciated to create a country. It shows which variables a country needs.
 * @param id: the id of a Country
 * @param name: the name of a Country
 * @param code: the code of a country
*/
export class Country {
    id: number;
    name: string;
    code: string;
    /**
    consturctor(): The constructor is used to set the variables once this class is instanciated.
    */
    constructor(id: number|undefined, name: string, code: string) {
        this.id = id || -1;
        this.name = name;
        this.code = code;
    }
    /**
    fromJSON(): this function tries to transform the a country JSON object into a regular country object.
    */
    static fromJSON(json: CountryJSON): Country {
        let country = Object.create(Country.prototype);
        return Object.assign(country, json);
    }
}
/*
This interface represent CountryJSON object.
*/
export interface CountryJSON {
    id: number;
    name: string;
    code: string;
}
