import { IDataConverter } from "./IDataConverter";
import { LocationPoint } from "../LocationPoint";
import { DataColumn } from "../DataColumn";
import { DataValue } from "../DataValue";

/**
 * Class that converts data from WolkyTolky.
 */
export class WolkyTolkyDataConverter implements IDataConverter {

    /**
     * Transform the location data of the WolkyTolky equipment to location points.
     * Where the 0th element contains the most recent value.
     * @param data The data to transform to location points.
     */
    transformLocationData(data: string): LocationPoint[] {

        const stringArray = JSON.parse(data) as Array<string>;
        stringArray.splice(0, 1);
        console.log(stringArray);
        var locationPoints: LocationPoint[] = [];
        stringArray.forEach(a => {
            var data = a.toString().split(";");
            locationPoints.push(new LocationPoint(+data[3], +data[2]));
        });

        return locationPoints;
    }

    /**
     * Transform the WolkyTolky measurement data to an array of [[DataValues]], which is a list
     * that contains the most recent measurements.
     * @param data The json data from which to select the most recent data.
     * @param dataColumns The columns used to map each column of the data to.
     */
    transformLiveData(data: string, dataColumns: DataColumn[]): DataValue[] {
        const stringArray = JSON.parse(data) as Array<string>;
        var liveData: DataValue[] = [];
        var i = 0;

        // Take the last row, since this is the most recent data.
        var latestData = stringArray[stringArray.length - 2].valueOf().toString();
        console.log(latestData);
        var dataRowValues = latestData.split(";");

        dataColumns.forEach(map => {
            // For each column take the measured value.
            liveData.push(new DataValue(map.column, map.unit, dataRowValues[i]));
            i++;
        });

        return liveData;
    }
}