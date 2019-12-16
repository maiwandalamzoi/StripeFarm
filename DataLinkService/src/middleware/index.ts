import { DataRetriever } from "../services/Retrievers/DataRetriever";
import { WolkyTolkyDataRetriever} from
    "../services/Retrievers/WolkyTolkyDataRetriever";
var cron = require('node-cron');
import { getEquipmentIdsSaveData } from "../services/datalinking/providers/EquipmentInformationDataProvider";
import { getWolkyTolkyEqByEquipmentId } from "../services/datalinking/providers/WolkyTolkyDataProvider";


/*
In ./middleware/index.ts we will import all of middleware for providing a single
connection point for our server.ts. And we will put more stuff here in the future.
*/
import {
    handleCors,
    handleBodyRequestParsing,
    handleCompression
} from "./common";
import { WolkyTolkyEqEntity } from "../utils/WolkyTolkyEqEntity";


export default [handleCors, handleBodyRequestParsing, handleCompression];

/**
 * Runs all the data retrievers that will store all the retrieved data.
*/
export async function runDataRetrievers() {
    var dataRetrievers: DataRetriever[] = [];

    // Find for which equipments the data should be saved to the database.
    var equipmentIds = await getEquipmentIdsSaveData(true);
    var wolkyTolkyEquipments: WolkyTolkyEqEntity[] = [];


    // Find all the relevant WolkyTolky equipments from the database.
    for (var id of equipmentIds) {
        var eq = await getWolkyTolkyEqByEquipmentId(id);
        if (eq) {
            wolkyTolkyEquipments.push(eq);
        }
    }

    for (var wt of wolkyTolkyEquipments) {
        if (wt.apiKey && wt.equipmentId && wt.stationId) {
            var dataRetriever = new WolkyTolkyDataRetriever(wt.stationId,
                wt.apiKey,
                wt.equipmentId,
                `WolkyTolky station: ${wt.stationId}`);
            dataRetrievers.push(dataRetriever);
        }
    }

    // Run all the data retrievers
    for (var retriever of dataRetrievers) {
        // Run first once, next one will follow the schedule.
        console.log(`Data retriever running ${retriever.retrieverName}`);
        retriever.run();

        // Schedule each retriever every 24 hours.
        cron.schedule("0 0 0 1 * *",
            () => {
                console.log(`Data retriever running ${retriever.retrieverName}`);
                retriever.run();
            });
    }
}

