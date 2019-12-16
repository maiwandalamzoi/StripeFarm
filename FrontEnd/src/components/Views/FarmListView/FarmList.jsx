/* External imports */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Paper, Dialog, DialogContent } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

/* Libraries */
import GridLoader from 'react-spinners/GridLoader';
import MaterialTable from 'material-table';

/* Local imports */
import AddFarm from '../AddFarmView/AddFarm';
import { getFarms } from '../../../utils/Controllers/FarmController';
import { isFavorite, deleteFavorite, addFavorite } from '../../../utils/Controllers/UserController';

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
		width: '80%'
	}
}));

/*
    Renders the farm list
*/
const FarmList = () => {
	const classes = useStyles();

	/*
        open: contains the state of the dialog
        data: contains the state of the current data
        isLoading: this constant handles the state of the loading icon
        state: contains the state of the current columns of the equipment table
    */
	const [open, setOpen] = useState(false);
	const [data, setData] = useState();
	const [isLoading, setIsLoading] = useState(false);

	const [state] = useState({
		columns: [
			{ title: 'Name', field: 'name' },
			{ title: 'Address', field: 'address' },
			{ title: 'Postal Code', field: 'postal_code' },
			{ title: 'Country', field: 'country.name' },
			{ title: 'Email', field: 'email' },
			{ title: 'Phone number', field: 'phone' },
			{
				title: 'Website',
				field: 'webpage',
				render: rowData => (
					<a href={'http://' + rowData.webpage} target='_blank' rel='noopener noreferrer'>
						{rowData.webpage}
					</a>
				)
			}
		]
	});

	/*
        AddFav(): handles creating a favorite from a farm by id and reloading the window
    */
	function addFav(farmId) {
		addFavorite(farmId);
		window.location.reload();
	}

	/*
        deleteFav(): handles removing a favorite from a farm by id and reloading the window
    */
	function deleteFav(farmId) {
		deleteFavorite(farmId);
		window.location.reload();
	}

	/*
       isFav(): handles checking if a farm is a favorite by id and returning it
    */
	function isFav(farmId) {
		return isFavorite(farmId);
	}

	/*
        fetchFarms(): fetchFarms gets all the farms that are stored in the database and returns them
    */
	async function fetchFarms() {
		try {
			const res = await getFarms();

			// change order to let the favs be on top of the list
			var res2 = [];
			for (var i = 0; i < res.length; i++) {
				if (isFav(res[i].id)) {
					res2.unshift(res[i]);
				} else {
					res2.push(res[i]);
				}
			}
			return res2;
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
            fetchFarms(): handle the loading icon state and call fetchFarms() to ensure the result is not empty
        */
		async function getFarms() {
			const res = await fetchFarms();
			setData(res);
			setIsLoading(false);
		}
		getFarms();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/*
        Loading: this component creates a loading icon while fetching data until complete to give feedback to the user
    */
	const Loading = () => {
		return <GridLoader css={'margin: 30vw auto 0'} sizeUnit={'px'} size={20} color={'#E07A5F'} />;
	};

	/*
        Return: return creates the view where the farm list table and corresponding actions are shown if @state{isLoading} is false
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
					<div className={classes.addBox}>
						<Button className={classes.submit} variant='contained' color='primary' onClick={() => setOpen(true)}>
							<AddIcon />
							Create a farm
						</Button>
					</div>
					<MaterialTable
						className={classes.table}
						title='Available farms'
						columns={state.columns}
						data={data}
						components={{
							Container: props => <Paper {...props} elevation={0} />
						}}
						options={{
							actionsColumnIndex: -1,
							exportButton: true,
							exportAllData: true,
							grouping: true,
							columnsButton: true,
							headerStyle: {
								fontWeight: 'bold',
								fontSize: 14
							},
							pageSize: 10
						}}
						actions={[
							rowData => ({
								icon: FavoriteIcon,
								tooltip: 'Delete favorite',
								onClick: (event, rowData) => deleteFav(rowData.id),
								disabled: !isFav(rowData.id),
								hidden: !isFav(rowData.id)
							}),
							rowData => ({
								icon: FavoriteBorderIcon,
								tooltip: 'Add favorite',
								onClick: (event, rowData) => addFav(rowData.id),
								disabled: isFav(rowData.id),
								hidden: isFav(rowData.id)
							})
						]}
					/>
				</React.Fragment>
			)}
			{/* Add farm dialog */}
			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogContent className={classes.dialog}>
					<AddFarm />
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default FarmList;
