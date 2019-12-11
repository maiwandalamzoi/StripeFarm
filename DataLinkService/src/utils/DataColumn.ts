/**
 * Class containing information regarding a column of data.
 */
export class DataColumn {

    // The name of the column. 
    column: string;

    // The unit of the data in the column.
    unit: string;

    /**
     * @constructor Constructor for [[DataColumn]].
     * @param column The name of the column.
     * @param unit The unit of the data in the column.
     */
    constructor(column: string, unit: string) {
        this.column = column;
        this.unit = unit;
    }
}