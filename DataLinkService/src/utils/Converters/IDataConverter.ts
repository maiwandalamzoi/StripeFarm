import { LocationPoint } from "../LocationPoint";
import { DataColumn } from "../DataColumn";
import { DataValue } from "../DataValue";

/**
 * Standard interface for data conversion.
 */
export interface IDataConverter {
    /**
     * Transform the latest observation data to a list of [[DataValue]].
     * @param data The data to convert.
     * @param dataColumns The metadata per column.
     */
    transformLiveData(data: string, dataColumns: DataColumn[]): DataValue[];

    /**
     * Transform the location data to a list of [[LocationPoint]].
     * @param data The data to transform.
     */
    transformLocationData(data: string): LocationPoint[];
}