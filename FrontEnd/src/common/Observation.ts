import { ObservationVariable, ObservationVariableJSON } from "./ObservationVariable";
import { ObservationObjectType } from "./ObservationObjectType";
/**
 * The observation class can be instanciated to create a observation.
 * It shows which variables a observation has, and which functies the class provides.
 * @param type: this is the type of the observation
 * @param context: this is the context fo the observation.
 * @param parameter: this is the parameter of the observation.
 * @param descripition: this is the description of the observation
 * @param unit:  this is the unit of the observation.
 * @param conditions: this is the condition of the observation
 */
export class Observation {
    type: ObservationObjectType;
    context: string;
    parameter: string;
    description: string;
    unit: string;
    conditions: ObservationVariable[];
    /**
     * consturctor(): The constructor is used to set the variables once this class is instanciated.
     */
    constructor(type: ObservationObjectType, context: string, parameter: string, description: string, unit: string, conditions: ObservationVariable[]) {
        this.type = type;
        this.context = context;
        this.parameter = parameter;
        this.description = description;
        this.unit = unit;
        this.conditions = conditions;
    }
    /**
     * toJSON(): this function tries to transform the current object into a JSON object
     */
    toJSON() {
        var tempUnit = null;
        var tempCondition = null;
        if (this.unit !== ''){
            tempUnit = this.unit
        }
        if (this.conditions[0].parameter !== '' || this.conditions[0].unit !== ''){
            tempCondition = this.conditions.map(condition => condition.toJSON());
        }
        return {
            type: this.type,
            context: this.context,
            parameter: this.parameter,
            description: this.description,
            unit: tempUnit,
            conditions: tempCondition
        }
    }
    /**
     * fromJSON(): this function tries to transform a JSON object into the current object.
     */
    static fromJSON(json: ObservationJSON): Observation {
        let datamap = Object.create(Observation.prototype);
        var tempCondition = new Array<any>();
        if (json.conditions !== null) {
            tempCondition = json.conditions.map(condition => ObservationVariable.fromJSON(condition))
        }
        return Object.assign(datamap, json, {
            conditions: tempCondition
        });
    }
}
/**
 * This interface represent observationJSON object.
 */
export interface ObservationJSON {
    type: string;
    context: string;
    parameter: string;
    description: string;
    unit: string;
    conditions: ObservationVariableJSON[];
}
