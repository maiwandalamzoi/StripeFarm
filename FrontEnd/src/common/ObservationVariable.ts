/**
 * The observation variable class can be instanciated to create an observation variable.
 * It shows which variables observationVariable has, and which functies the class provides.
 * @param parameter: the parameter of the observatino variable.
 * @param value: the value of the observation variable.
 * @param unit: the unit of the observation variable.
 */
export class ObservationVariable {
    parameter: string;
    value: number;
    unit: string;
    /**
     * consturctor(): The constructor is used to set the variables once this class is instanciated.
     */
    constructor(parameter: string, value: number, unit: string) {
        this.parameter = parameter;
        this.value = value;
        this.unit = unit;
    }
    /**
     * toJSON(): this function tries to transform the current object into a JSON object
     */

    toJSON() {
        return {
            parameter: this.parameter,
            value: this.value,
            unit: this.unit
        }
    }
    /**
     * fromJSON(): this function tries to transform a JSON object into the current object.
     */
    static fromJSON(json: ObservationVariableJSON): ObservationVariable {
        let variable = Object.create(ObservationVariable.prototype);
        return Object.assign(variable, json);
    }
}
/**
 * This interface represent observationVariableJSON object.
 */
export interface ObservationVariableJSON {
    parameter: string;
    value: number;
    unit: string;
}
