/**
 * Class containing location information
 */
export class LocationPoint {

    // The latitude of the location.
    latitude: number;

    // The longitude of the location.
    longitude: number;

    /**
     * @constructor Constructs a [[LocationPoint]] 
     * @param latitude The latitude of the location.
     * @param longitude The longitude of the location.
     */
    constructor(latitude: number, longitude: number) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
}