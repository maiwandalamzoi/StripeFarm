/**
 * This class contains the API endpoints of this microservice.
 */

import { Request, Response } from "express";
import { getLiveDataByFilter } from "./providers/DataProvider";
import { getEquipmentsWt, getEquipmentsWtById, updateWolkyTolkyEquipment, postWolkyTolkyEquipment,
    deleteEquipmentsWtById
} from "./providers/WolkyTolkyDataProvider";
import { updateLocationInformationByEquipmentId, postLocationInformation, getLocationInformationByEquipmentId,
    deleteLocationInformationByEquipmentId
} from "./providers/EquipmentInformationDataProvider";

export default [

    // GET: Route to call and receive the live data.
    {
        path: "/api/v1/data/live/",
        method: "get",
        handler: [
            async ({ query }: Request, res: Response) => {
                if (query.farmId == undefined || query.fieldId == undefined) {
                    // The query is invalid
                    res.status(665).send("Invalid query");
                }
                    
                const result = await getLiveDataByFilter(query.farmId, query.fieldId, query.cropfieldId);
                if (result == undefined || result.length === 0) {
                    // Report that no data was found.
                    res.status(666).send("No data found");
                } else {
                    // Query was valid and a result is reported back.
                    res.status(200).send(JSON.stringify(result));
                }
            }
        ]
    },

    // GET: Route to call to get the WolkyTolky equipment.
    {
        path: "/api/v1/data/equipment_wt",
        method: "get",
        handler: [
            async ({ query }: Request, res: Response) => {
                // If an id is send, find the WolkyTolky equipment by that id.
                if (query.id) {
                    const result = await getEquipmentsWtById(query.id);

                    // There does not exist such a WolkyTolky equipment.
                    if (result == undefined)
                        res.status(205).send("This WolkyTolky equipment does not exist");
                    else
                        res.status(200).send(result);
                } else {
                    // If no id is reported with the call, retrieve all WolkyTolky equipments.
                    const result = await getEquipmentsWt();
                    res.status(200).send(result);
                }
            }
        ]
    },

    // POST: route to post WolkyTolky equipment.
    {
        path: "/api/v1/data/equipment_wt",
        method: "post",
        handler: [
            async (req: Request, res: Response) => {
                // Add WolkyTolky equipment to the database.
                const result = await postWolkyTolkyEquipment(req.body);
                res.status(201).send(result);
            }
        ]
    },

    // PUT: route to update WolkyTolky equipment.
    {
        path: "/api/v1/data/equipment_wt",
        method: "put",
        handler: [
            async (req: Request, res: Response) => {
                // Update WolkyTolky equipment in the database.
                const result = await updateWolkyTolkyEquipment(req.body);
                res.status(201).send(result);
            }
        ]
    },
    {
        path: "/api/v1/data/equipment_wt",
        method: "delete",
        handler: [
            async ({ query }: Request, res: Response) => {
                // Delete WolkyTolky equipment from the database.
                const result = await deleteEquipmentsWtById(query.id);
                res.status(204).send(result);
            }
        ]
    },

    // Location information routes.

    {
        path: "/api/v1/data/location_information/:eqId",
        method: "put",
        handler: [
            async (req: Request, res: Response) => {
                // Update LocationInformation in the database.
                await updateLocationInformationByEquipmentId(+req.params.eqId, req.body);
                res.status(201).send("Location information successfully updated.");
            }
        ]
    },
    // DELETE: Route to call to delete location information of an equipment.
    {
        path: "/api/v1/data/location_information/:eqId",
        method: "delete",
        handler: [
            async (req: Request, res: Response) => {
                // Delete LocationInformation in the database.
                await deleteLocationInformationByEquipmentId(+req.params.eqId);
                res.status(201).send("Location information successfully deleted.");
            }
        ]
    },

    // POST: Route to call to post location information.
    {
        path: "/api/v1/data/location_information",
        method: "post",
        handler: [
            async (req: Request, res: Response) => {
                // Add LocationInformation to the database.
                await postLocationInformation(req.body);
                res.status(201).send("Location information successfully created.");
            }
        ]
    },

    // GET: Route to call to get the location information.
    {
        path: "/api/v1/data/location_information/:eqId",
        method: "get",
        handler: [
            async (req: Request, res: Response) => {
                // Get LocationInformation from the database.
                const result = await getLocationInformationByEquipmentId(+req.params.eqId);
                res.status(200).send(result);
            }
        ]
    }
];