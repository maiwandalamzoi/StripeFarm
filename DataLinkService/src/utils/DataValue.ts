/**
* Class containing a measurement.
*/
export class DataValue {

    // The name of the measurement.
    name: string;

    // The unit of the measurement.
    unit: string;

    // The value of the measurement.
    value: string;

    /**
     * Constructor of the [[DataValue]] class.
     * @param name The name of the measurement.
     * @param unit The unit of the measurement.
     * @param value The value of the measurement.
     */
    constructor(name: string, unit: string, value: string) {
        this.name = name;
        this.unit = unit;
        this.value = value;
    }
}