import { Observation, ObservationJSON } from "./Observation";

/**
 * The data column class can be instanciated to create a data column.
 * It shows which variables a data column has, and which functies the class provides.
 * @param column: this is header of the column
 * @param observation: this is the observation that belongs to the column
*/
export class DataColumn {
    column: string;
    observation: Observation;
    /*
    consturctor(): The constructor is used to set the variables once this class is instanciated.
    */
    constructor(column: string, observation: Observation) {
        this.column = column;
        this.observation = observation;
    }
    /*
    toJSON(): this function tries to transform the current object into a JSON object
    */

    toJSON() {
        return {
            column: this.column,
            observation: this.observation.toJSON(),
        }
    }
    /*
    fromJSON(): this function tries to transform a JSON object into the current object.
    */
    static fromJSON(json: DataColumnJSON): DataColumn {
        let dataColumn = Object.create(DataColumn.prototype);
        return Object.assign(dataColumn, json, {
            observation: Observation.fromJSON(json.observation)
        });

    }
}
/*
This interface represent dataColumnJSON object.
*/
export interface DataColumnJSON {
    column: string;
    observation: ObservationJSON;
}
