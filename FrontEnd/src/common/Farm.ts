import { Country, CountryJSON } from "./Country";
import { AccessibilityType } from "./AccessibilityType";
/**
 * The farm class can be instanciated to create a farm.
 * It shows which variables a farm has, and which functies the class provides.
 * @param id: this is the id of the farm.
 * @param name: this is the name of the farm.
 * @param address: this is the address of the farm.
 * @param postal_doe: this is the postal code of the farm.
 * @param email: this is the email of the farm.
 * @param phone: this is the phone number of the farm.
 * @param webpage: this is the webpage of the farm.
 * @param country: this is the country of the farm.
 * @param accessibility: whether the access to the farm is private or public.
 */
export class Farm {
    id: number;
    name: string;
    address: string;
    postal_code: string;
    email: string;
    phone: string;
    webpage: string;
    country: Country;
    accessibility: AccessibilityType;
    /**
     * consturctor(): The constructor is used to set the variables once this class is instanciated.
     */
    constructor(id: number|undefined, name: string, address: string, postalCode: string, email: string, phone: string, webpage: string, country: Country, accessibility: AccessibilityType) {
        this.id = id || -1;
        this.name = name;
        this.address = address;
        this.postal_code = postalCode;
        this.email = email;
        this.phone = phone;
        this.webpage = webpage;
        this.country = country;
        this.accessibility = accessibility;
    }
    /**
     * toJSON(): this function tries to transform the current object into a JSON object
     */
    toJSON() {
        return {
            name: this.name,
            address: this.address,
            postal_code: this.postal_code,
            email: this.email,
            phone: this.phone,
            webpage: this.webpage,
            accessibility: this.accessibility,
            country_id: this.country.id
        }
    }
    /**
     * fromJSON(): this function tries to transform a JSON object into the current object.
     */
    static fromJSON(json: FarmJSON): Farm {
        let farm = Object.create(Farm.prototype);
        return Object.assign(farm, json, {
            country: Country.fromJSON(json.country),
        });
    }
}
/**
 * This interface represent farmJSON object.
 */
interface FarmJSON {
    id: number;
    name: string;
    address: string;
    postal_code: string;
    email: string;
    phone: string;
    webpage: string;
    country: CountryJSON;
    accessibility: string;
}
