/**
* Class containing a measurement.
*/
export class DataValue {
    name: string;
    unit: string;
    value: number;

    /**
     * Constructor of the [[DataValue]] class.
     * @param name The name of the measurement.
     * @param unit The unit of the measurement.
     * @param value The value of the measurement.
     */
    constructor(name: string, unit: string, value: number) {
        this.name = name;
        this.unit = unit;
        this.value = value;
    };
}
