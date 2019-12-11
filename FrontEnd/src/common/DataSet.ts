/**
 * The data set class can be instanciated to create a data set.
 * It shows which variables a data set has, and which functies the class provides.
 * @param column: this is the column of the data set
 * @param unit: this is the unit of the data set.
 * @param values: these are the values of the data set.
*/
export class DataSet {
    column: string;
    unit: string;
    values: number[];
    /*
    consturctor(): The constructor is used to set the variables once this class is instanciated.
    */
    constructor(column: string, unit: string, values: number[]){
        this.column = column;
        this.unit = unit;
        this.values = values;
    };


    // fromJSON is used to convert an serialized version
    // of the Farm to an instance of the class
    static fromJSON(json: DataJSON|string): DataSet {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json);
        } else {
            // create an instance of the Farm class
            let dataSet = Object.create(DataSet.prototype);
            // copy all the fields from the json object
            return Object.assign(dataSet, json);
        };
    };
};

// A representation of Farm's data that can be converted to
// and from JSON without being altered.
interface DataJSON {
    column: string;
    unit: string;
    values: number[];
};
