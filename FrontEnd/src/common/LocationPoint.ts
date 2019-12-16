/**
 * The locationPoint class can be instanciated to create a locationPoint.
 * It shows which variables a location point has, and which functies the class provides.
 * @param latitude: this is the latitude of the location point
 * @param longitude: this is the longitude of the location point.
 */
export class LocationPoint {
    latitude: number;
    longitude: number;
    /**
     * consturctor(): The constructor is used to set the variables once this class is instanciated.
     */
    constructor(latitude: number, longitude: number) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
    /**
     * fromJSON(): this function tries to transform a JSON object into the current object.
     */
    static fromJSON(json: LocationPointJSON): LocationPoint {
        let point = Object.create(LocationPoint.prototype);
        return Object.assign(point, json);
    }
    /**
     * toJSON(): this function tries to transform the current object into a JSON object
     */
    toJSON(){
        return {
            latitude: this.latitude,
            longitude: this.longitude
        }
    }

}
/**
 * This interface represent locationPointJSON object.
 */
export interface LocationPointJSON {
    latitude: number;
    longitude: number;
}
