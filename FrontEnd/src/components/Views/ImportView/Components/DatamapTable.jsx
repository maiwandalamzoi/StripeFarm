/* External imports */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

/* Libraries */
import GridLoader from 'react-spinners/GridLoader';
import MaterialTable from 'material-table';

/* Local imports */
import DatamapTableList from './DatamapTableList';
import { getDataMaps } from '../../../../utils/Controllers/MappingController';

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
    Renders the datamap table
*/
const DatamapTable = () => {
	const classes = useStyles();

	/*
        data: contains the state of the current data
        maps: contains the state of the current DataColumn array of the data
        state: contains the state of the current columns of the datamap table
        isLoading: this constant handles the state of the loading icon
    */
    const [data, setData] = useState([]);
	const state = {
		columns: [{ title: 'Name', field: 'name' }, { title: 'Description', field: 'description' }, { title: 'Has header', field: 'has_header' }, { title: 'Has coordinate', field: 'has_coordinate' }, { title: 'Has date', field: 'has_date' }, { title: 'Has time', field: 'has_time' }, { title: 'Model Id', field: 'model_id' }, { title: 'Accessibility', field: 'accessibility' }]
	};
	const [isLoading, setIsLoading] = useState(false);

	/*
        fetchDataMaps(): fetchDataMaps gets all the equipment models that are stored in the database and returns them
    */
	async function fetchDataMaps() {
		try {
			const res = await getDataMaps();
			return res;
		} catch (e) {
			console.error(e.message);
		}
	}

	/*
        useEffect(): useEffect refreshes the render after a state has been updated
    */
	useEffect(() => {
		setIsLoading(true);

		/*
            getDataMaps(): handle the loading icon state and call fetchDataMaps() to ensure the result is not empty
        */
		async function getDataMaps() {
			const res = await fetchDataMaps();
			if (res) {
                const tempData = res;
                tempData.forEach(value => {
                    if (value.has_header) {
                        value.has_header = '✔';
                    } else {
                        value.has_header = '✖';
                    }
                    if (value.has_coordinate) {
                        value.has_coordinate = '✔';
                    } else {
                        value.has_coordinate = '✖';
                    }
                    if (value.has_date) {
                        value.has_date = '✔';
                    } else {
                        value.has_date = '✖';
                    }
                    if (value.has_time) {
                        value.has_time = '✔';
                    } else {
                        value.has_time = '✖';
                    }
                });
                setData(tempData);
			}
			setIsLoading(false);
		}

		getDataMaps();
	}, []);

	/*
        Loading: this component creates a loading icon while fetching data until complete to give feedback to the user
    */
	const Loading = () => {
		return <GridLoader css={'margin: 30vw auto 0'} sizeUnit={'px'} size={20} color={'#E07A5F'} />;
	};

	/*
        Return: return creates the view where the datamap table is shown if @state{isLoading} is false
        isLoading:
            true: show loading icon
            false: show field name and cropfield cards
    */
	return (
		<div className={classes.root}>
			{isLoading ? (
				<Loading />
			) : (
				<MaterialTable
					className={classes.table}
					title='Datamaps'
					columns={state.columns}
					data={data}
					components={{
						Container: props => <Paper {...props} elevation={1} />
					}}
					options={{
						exportButton: true,
						grouping: true,
						columnsButton: true,
						headerStyle: {
							fontWeight: 'bold',
							fontSize: 14
						},
						pageSize: 5
                    }}
                    detailPanel={rowData => {
                        return (
                            <DatamapTableList dataColumns={rowData.maps} />
                        )
                      }}
                      onRowClick={(event, rowData, togglePanel) => togglePanel()}
				/>
			)}
		</div>
	);
};

export default DatamapTable;
