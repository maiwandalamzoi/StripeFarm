/* External imports */
import React, { useState } from 'react';

/* Libraries */
import MaterialTable from 'material-table';

/* Internal imports */
import { Role } from '../../../common/Role';
import { getUserId } from '../../../utils/Controllers/UserController';
import { changeUserRoleOnFarm, createUserRoleOnFarm, getAllUsersOnFarm } from '../../../utils/Controllers/RoleController';

/*
Renders the table based on its parent's values
*/
const UserManagementTable = (props: any) => {
	/*
	farmId: contains the farmId of the current active farm
	columns: contains the column headers of the table
	title: contains the title of the current table
	tableData: contains the state that handles the table data based on its parent
	*/
	const farmId = props.farmId;
	const columns = props.columns;
	const title = props.title;
	const [tableData, setTableData] = useState(props.data);

	/*
	changeUserRole(): handles the change of user permission on this farm
	@param newData: updated row data to specify user role
	@return: Promise that changes the user role if the request resolves
	*/
	const changeUserRole = (newData: any): Promise<any> => {
		return new Promise((resolve, reject) => {
			setTimeout(async () => {

				var bufferData = tableData;
				for (let row of bufferData) {
					if (row.id === newData.id) {
						if (!(Number(newData.id) === getUserId() && newData.role !== 'farm_admin')) {
							row.role = newData.role;
						}
					}
				}
				try {
					if (Number(newData.id) === getUserId() && newData.role !== 'farm_admin') {
						setTableData(bufferData);
						window.alert('You can not change your own role!');
						reject();
						return;
					}
					if (await changeUserRoleOnFarm(farmId, newData.id, new Role(newData.role))) {
						setTableData(bufferData);
						resolve();
					} else {
						reject();
					}
				} catch (error) {
					console.log(error);
					reject();
				}

			}, 1000);
		});
	};

	/*
	addUserRole(): handles the addition of a user role on this farm
	@param newData: updated row data to specify user role
	@return: Promise that add the user role if the request resolves
	*/
	const addUserRole = (newData: any): Promise<any> => {
		return new Promise((resolve, reject) => {
			setTimeout(async () => {

				try {
					console.log(farmId)
					if (await createUserRoleOnFarm(farmId, newData.email, new Role(newData.role))) {
						var users = await getAllUsersOnFarm(farmId);
						users = users.map((e: any) => {
							return { id: e.user_id, role: e.role.name, email: e.email };
						});
						setTableData(users);
						console.log(users);
						resolve();
					} else {
						reject();
					}
				} catch (error) {
					console.log(error);
					reject();
				}

			}, 1000);
		});
	};

	/*
	Return: return creates the view where the table is shown
	*/
	return (
		<MaterialTable
		title={title}
		columns={columns}
		data={tableData}
		editable={{
			onRowUpdate: (newData: any) => changeUserRole(newData),
			onRowAdd: (newData: any) => addUserRole(newData)
		}}
		/>
	);
};

export default UserManagementTable;
