import { Observation } from "../Observation";
import { ObservationVariable } from "../ObservationVariable";
import { ObservationObjectType } from "../ObservationObjectType";
import { ObservationLog } from "../ObservationLog";

/**
 * This class can be instanciated to create an ObservationDTO. It shows which variables a ObservationDTO needs.
 * @param id: the id of an observationDTO
 * @param type: the type of an observationDTO
 * @param cotext: the context of an observationDTO
 * @param parameter: the parameter of an observationDTO
 * @param description: the description of an observationDTO
 * @param unit: the unit of an observationDTO
 * @param conditions: the conditions of an observationDTO
 * @param log: the log of an observationDTO 
*/
export class ObservationDTO {
    id: number;
    type: ObservationObjectType;
    context: string;
    parameter: string;
    description: string;
    unit: string;
    conditions: ObservationVariable[];
    log: ObservationLog[];

    constructor(
        id: number,
        type: ObservationObjectType,
        context: string,
        parameter: string,
        description: string,
        unit: string,
        conditions: ObservationVariable[],
        log: ObservationLog[])
    {
        this.id = id;
        this.type = type;
        this.context = context;
        this.parameter = parameter;
        this.description = description;
        this.unit = unit;
        this.conditions = conditions;
        this.log = log;
    }
    // toJSON is automatically used by JSON.stringify
    toJSON() {
        return {
            type: this.type,
            context: this.context,
            parameter: this.parameter,
            description: this.description,
            unit: this.unit,
            conditions: JSON.parse(JSON.stringify(this.conditions))
        }
    }

    // fromJSON is used to convert an serialized version
    // of the Farm to an instance of the class
    static fromJSON(json: ObservationJSON | string): Observation {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json);
        } else {
            // create an instance of the Farm class
            let datamap = Object.create(Observation.prototype);
            // copy all the fields from the json object
            return Object.assign(datamap, json);
        }
    }
}

// A representation of Farm's data that can be converted to
// and from JSON without being altered.
interface ObservationJSON {
    id: string;
    type: string;
    context: string;
    parameter: string;
    description: string;
    unit: string;
    conditions: string;
    log: string;
}
