/** This module returns the sidebaritems that should be shown based
 *  on the selected farm and the user role on that farm.
 */

import React from 'react';
import HistoryView from '../Views/HistoryView/HistoryView';
import FarmListView from '../Views/FarmListView/FarmList';
import LiveView from '../Views/LiveView/LiveView';
import FieldView from '../Views/FieldsView/FieldView';
import FarmSettingsView from '../Views/FarmSettingsView/FarmSettingsView';
import DatamapView from '../Views/ImportView/DatamapView';
import EquipmentView from '../Views/EquipmentView/EquipmentList';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import TimeLineIcon from '@material-ui/icons/Timeline';
import SettingsSystemDaydreamIcon from '@material-ui/icons/SettingsSystemDaydream';
import LayersIcon from '@material-ui/icons/Layers';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import RouterIcon from '@material-ui/icons/Router';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import { getUserRoleOnFarm } from '../../utils/Controllers/RoleController';
import { getUserId } from '../../utils/Controllers/UserController';
import { Role } from '../../common/Role';
import { getFarm } from '../../utils/Controllers/FarmController';
import { Farm } from '../../common/Farm';
import { AccessibilityType } from '../../common/AccessibilityType';

export default async function SidebarItems(farmId: number) {
	var returnItems = []; // Array to store sidebaritems

	/* Retrieve user role from database */
	let role: Role = await getUserRoleOnFarm(farmId, getUserId());

	/* Farm List: */
	// The farm list view should always be shown on the sidebar!
	returnItems.push({
		title: 'Farms',
		icon: <HomeWorkIcon />,
		path: <FarmListView />
	});

	// A farm is selected and we should show sidebaritems
	if (farmId !== -1) {

		/* Check if farm is public or private */
		let publicFarm: boolean = false;
		try {
			// Get farm from database and check accessibility
			let farm: Farm = await getFarm(farmId);
			if (farm.accessibility === AccessibilityType.public){
				publicFarm = true;
			}
		} catch {
			// Error received because farm is private and role = user, so publicFarm = false
		}

		// The following sidebaritems will only be shown if the user has role farm_admin || farmer || researcher
		// or when the farm is public.
		if (role.name === 'farm_admin' || role.name === 'farmer' || role.name === 'researcher' || publicFarm) {
			/* Live view: */
			returnItems.push({
				title: 'Live',
				icon: <TrackChangesIcon />,
				path: <LiveView fID={farmId} />
			});

			/* History view: */
			returnItems.push({
				title: 'History',
				icon: <TimeLineIcon />,
				path: <HistoryView fID={farmId} />
			});

			/* Field view: */
			returnItems.push({
				title: 'Fields',
				icon: <LayersIcon />,
				path: <FieldView fID={farmId}  role={role.name}/>
			});

			/* Datamap view: */
			returnItems.push({
				title: 'Datamaps',
				icon: <DeveloperBoardIcon />,
				path: <DatamapView fID={farmId} />
			});

			/* Equipment view: */
			returnItems.push({
				title: 'Equipments',
				icon: <RouterIcon />,
				path: <EquipmentView fID={farmId} role={role.name}/>
			});
		}

		// The following sidebaritems will only be shown if the user has role farm_admin.
		if (role.name === 'farm_admin') {

			/* Farm settings view: */
			returnItems.push({
				title: 'Farm Settings',
				icon: <SettingsSystemDaydreamIcon />,
				path: <FarmSettingsView fID={farmId} />
			});
		}
	}
	return returnItems;
}
