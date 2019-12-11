import { LocationPoint } from "./LocationPoint";
/**
 * The observation log class can be instanciated to create a observation log.
 * It shows which variables a observation log has, and which functies the class provides.
 * @param id: this is the id of the observation log
 * @param observation_id: this is the id of the obesrvation that is logged
 * @param datetime: this is the date of the observatin log
 * @param value: this is the value of the observation log.
 * @param unit: this is the unit of the observation log.
 * @param coordinate: these are the coordinates of the observation log.
 */
export class ObservationLog {
    id: number;
    observation_id: number;
    datetime: Date;
    value: number;
    unit: string;
    coordinate: LocationPoint;
    /**
     * consturctor(): The constructor is used to set the variables once this class is instanciated.
     */
    constructor(observation_id: number, datetime: Date, value: number, unit: string, coordinate: LocationPoint) {
        this.id = -1;
        this.observation_id = observation_id;
        this.datetime = datetime;
        this.value = value;
        this.coordinate = coordinate;
        this.unit = unit;
    }
}
