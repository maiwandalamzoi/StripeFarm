/* External imports */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Paper, Dialog, DialogContent } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

/* Libraries */
import GridLoader from 'react-spinners/GridLoader';
import MaterialTable from 'material-table';

/* Local imports */
import AddEq from './AddEq.tsx';
import EditEq from './EditEq.tsx';
import { getEquipments, deleteEquipment } from '../../../utils/Controllers/EquipmentController';
import { getEquipmentModels } from '../../../utils/Controllers/EquipmentModelController';
import { getFarmField } from '../../../utils/Controllers/FieldController';
import { getCropField } from '../../../utils/Controllers/CropFieldController';
import { getEquipmentInfo } from '../../../utils/Controllers/EquipmentInfoController';


/*
    Styles for the view
*/
const useStyles = makeStyles(theme => ({
	root: {
		margin: theme.spacing(3)
	},
	addBox: {
		textAlign: 'right',
		marginBottom: theme.spacing(1)
	},
	submit: {
		padding: theme.spacing(1.5, 4),
		fontSize: 14,
		fontWeight: 900,
		color: 'white',
		background: theme.palette.primary.main,
		boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
		transition: 'all 0.2s ease',
		'&:hover': {
			background: theme.palette.primary.dark
		}
	},
	table: {
		boxShadow: 'none',
		marginBottom: theme.spacing(3)
	},
	dialog: {
		margin: '0 auto',
		// width: '80%',
		padding: 20
	}
}));

/*
    Renders the equipment table
*/
const EquipmentTable = fID => {
	const classes = useStyles();

	/*
        farmID: contains the farmId of the current active farm
        role: contains the role of the user for the current active farm
        open: contains the state of the dialog
        openEdit: contains the state to allow the editing of the equipment values
        data: contains the state of the current data
        modelData: contains the state of the current equipment model data
        eqId: contains the state of the current equipment id
        state: contains the state of the current columns of the equipment table
        stateModel: contains the state of the current columns of the equipment model table
        isLoading: this constant handles the state of the loading icon
    */
	const farmId = fID.fID;
	const role = fID.role;
	const [open, setOpen] = useState(false);
	const [openEdit, setEditOpen] = useState(false);
	const [data, setData] = useState();
	const [modelData, setModelData] = useState();
	const [eqId, setEqId] = useState();
	const [state, setState] = useState({
		columns: [{ title: 'Name', field: 'name' }, { title: 'Description', field: 'description' }, { title: 'Field', field: 'field_name' }, { title: 'Cropfield', field: 'cropfield_name' }, { title: 'Manufacturing date', field: 'manufacturing_date' }, { title: 'Serial number', field: 'serial_number' }, { title: 'Accessibility', field: 'accessibility' }, { title: 'Model Id', field: 'model_id' }]
	});
	const [stateModel] = useState({
		columns: [{ title: 'Brand', field: 'brand_name' }, { title: 'Model', field: 'model' }, { title: 'Model year', field: 'model_year' }, { title: 'Series', field: 'series' }, { title: 'Software version', field: 'software_version' }, { title: 'Description', field: 'description' }, { title: 'Model Id', field: 'id' }]
	});
	const [isLoading, setIsLoading] = useState(false);

	/*
        allowedToEdit(): function that checks if the user is allowed to edit the table values
    */
	function allowedToEdit() {
		return role === 'farm_admin' || role === 'farmer';
	}

	/*
        fetchEquipment(): fetchEquipment gets all the equipment that are stored in the database and returns them
    */
	async function fetchEquipment() {
		try {
			const res = await getEquipments(farmId);
			for (var i in res) {
				try {
				const eq_info = await getEquipmentInfo(res[i].id);
				if (eq_info) {
					if (eq_info.fieldId) {
						const field_id = eq_info.fieldId;
						const field = await getFarmField(farmId, field_id)
						res[i].field_name = field.field_name;
						if (eq_info.cropfieldId) {
							const cropfield_id = eq_info.cropfieldId;
							const cropfield = await getCropField(farmId, field_id, cropfield_id);
							res[i].cropfield_name = cropfield.name;
						}
					}
				}
			} catch (e) {
				console.error(e.message);
			}
			}
			return res;
		} catch (e) {
			setData();
			console.error(e.message);
		}
	}

	/*
        fetchEquipmentModels(): fetchEquipmentModels gets all the equipment models that are stored in the database and returns them
    */
	async function fetchEquipmentModels() {
		try {
			const res = await getEquipmentModels();
			return res;
		} catch (e) {
			setModelData();
			console.error(e.message);
		}
	}

	/*
        useEffect(): useEffect refreshes the render after a state has been updated
    */
	useEffect(() => {
		setIsLoading(true);

		/*
            getEquipment(): handle the loading icon state and call fetchEquipment() to ensure the result is not empty
        */
		async function getEquipment() {
			const res = await fetchEquipment();
			if (res) {/*
				compare(): compares the two parameters against eachother and returns order number
				@param a: first input to be compared against
				@param b: second input to be compared against
			*/
				function compare(a, b) {
					if (a.id < b.id) {
						return -1;
					}
					if (a.id > b.id) {
						return 1;
					}
					return 0;
				}
				setData(res.sort(compare));
			}
			setIsLoading(false);
		}

		/*
            getEquipmentModels(): handle the loading icon state and call fetchEquipmentModels() to ensure the result is not empty
        */
		async function getEquipmentModels() {
			const res = await fetchEquipmentModels();
			if (res) {
				/*
                    compare(): compares the two parameters against eachother and returns order number
                    @param a: first input to be compared against
                    @param b: second input to be compared against
                */
				function compare(a, b) {
					if (a.id < b.id) {
						return -1;
					}
					if (a.id > b.id) {
						return 1;
					}
					return 0;
				}
				setModelData(res.sort(compare));
			}
			setIsLoading(false);
		}

		getEquipment();
		getEquipmentModels();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fID.fID, open, openEdit]);

	/*
        Loading: this component creates a loading icon while fetching data until complete to give feedback to the user
    */
	const Loading = () => {
		return <GridLoader css={'margin: 30vw auto 0'} sizeUnit={'px'} size={20} color={'#E07A5F'} />;
	};

	/*
        editEquipment(): handle the editable state of the active equipment
        @param equipment: current active equipment to be set to be editable
    */
	function editEquipment(equipment) {
		setEqId(equipment);
		setEditOpen(true);
	}

	/*
        editEquipment(): handle the deletion of the equipment on click after accepting confirmation
        @param equipment_id: id of the current active equipment to be deleted
        @param equipment_name: name of the current active equipment to be deleted
    */
	const deleteEquipmentHandler = async (equipment_id, equipment_name) => {
		var confirmation = window.confirm('Are you sure you want to delete ' + equipment_name + '?');
		if (confirmation === true) {
			if (await deleteEquipment(equipment_id, farmId)) {
				alert(equipment_name + ' has been deleted.');
				window.location.reload();
			} else {
				alert('Something went wrong when trying to delelete ' + equipment_name + '.');
			}
		}
	};

	/*
        addButton(): button to add a new equipment if @Boolean(allowedToEdit())
    */
	function addButton() {
		if (allowedToEdit()) {
			return (
				<div className={classes.addBox}>
					<Button className={classes.submit} variant='contained' color='primary' onClick={() => setOpen(true)}>
						<AddIcon />
						Add equipment
					</Button>
				</div>
			);
		}
	}

	/*
        Return: return creates the view where the equipment table and corresponding buttons are shown if @state{isLoading} is false
        isLoading:
            true: show loading icon
            false: show field name and cropfield cards
    */
	return (
		<div className={classes.root}>
			{isLoading ? (
				<Loading />
			) : (
					<React.Fragment>
						{addButton()}
						<MaterialTable
							className={classes.table}
							title='Equipment'
							columns={state.columns}
							data={data}
							components={{
								Container: props => <Paper {...props} elevation={1} />
							}}
							options={{
								actionsColumnIndex: -1,
								exportButton: true,
								grouping: true,
								columnsButton: true,
								headerStyle: {
									fontWeight: 'bold',
									fontSize: 14
								},
								pageSize: 5
							}}
							actions={[
								rowData => ({
									icon: EditIcon,
									tooltip: 'Edit equipment',
									onClick: (event, rowData) => editEquipment(rowData.id),
									disabled: !allowedToEdit(),
									hidden: !allowedToEdit()
								}),
								rowData => ({
									icon: DeleteIcon,
									tooltip: 'Delete equipment',
									onClick: (event, rowData) => deleteEquipmentHandler(rowData.id, rowData.name),
									disabled: !allowedToEdit(),
									hidden: !allowedToEdit()
								})
							]}
						/>
						<MaterialTable
							className={classes.table}
							title='Equipment Model'
							columns={stateModel.columns}
							data={modelData}
							components={{
								Container: props => <Paper {...props} elevation={0} />
							}}
							options={{
								actionsColumnIndex: -1,
								exportButton: true,
								grouping: true,
								columnsButton: true,
								headerStyle: {
									fontWeight: 'bold',
									fontSize: 14
								},
								pageSize: 5
							}}
							actions={[]}
						/>

						<Dialog open={open} onClose={() => setOpen(false)}>
							<DialogContent className={classes.dialog}>
								<AddEq fID={farmId} open={open} setOpen={setOpen} />
							</DialogContent>
						</Dialog>

						<Dialog open={openEdit} onClose={() => setEditOpen(false)}>
							<DialogContent className={classes.dialog}>
								<EditEq fID={farmId} eqId={eqId} openEdit={openEdit} setEditOpen={setEditOpen} />
							</DialogContent>
						</Dialog>
					</React.Fragment>
				)}
		</div>
	);
};

export default EquipmentTable;
