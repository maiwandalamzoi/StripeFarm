/* External imports */
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, IconButton, CardContent, Collapse, makeStyles, Divider } from '@material-ui/core';
import ExploreIcon from '@material-ui/icons/Explore';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

/* Libraries */
import GridLoader from 'react-spinners/GridLoader';
import clsx from 'clsx';

/* Local imports */
import { getLiveData } from '../../../utils/Controllers/FarmDataController';
import { DataValue } from '../../../common/DataValue';

/*
    Styles for the view
*/
const useStyles = makeStyles(theme => ({
	card: {
        height: 70,
        width: 300,
        margin: theme.spacing(1),
    },
    cardExpand: {
        height: 'auto'
    },
	expand: {
		transform: 'rotate(0deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest
		})
	},
	expandOpen: {
		transform: 'rotate(180deg)'
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
    },
    listItem: {
        display: 'flex',
        justifyContent: 'space-between',
        '& span': {
            margin: theme.spacing(1)
        }
    }
}));

/*
    Function to map an id to a color
    @param id: the id of an element that needs to be mapped to a color
    @returns: hexadecimal code of a color
*/
export const getColor = (id: number) => {
	var color = '#' + Math.floor(Math.abs(Math.sin(id) * 16777215) % 16777215).toString(16);
	return color;
};

/*
    CardComponent returns a Card embedded with the live data of a cropfield
*/
const CardComponent = (props: any) => {
    const classes = useStyles();

    /*
        cropfield: this constant is the current cropfield for the card
        liveData: this constant handles the state of the current live data for this cropfield
        isLoading: this constant handles the state of the loading icon
        expanded: this constant handles the state of the Collapse to show more data
    */
    const cropfield = props.cropfield;
    const [liveData, setLiveData] = useState(Array<DataValue>());
    const [isLoading, setIsLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);

    /*
        handleExpandClick(): handles the click from the 'show more' button and sets the state of the Collapse
    */
	const handleExpandClick = () => {
		setExpanded(!expanded);
    };

	/*
        fetchData(): fetchData gets the live data belonging to the current cropfield and returns them
        @returns: the live data of a cropfield
    */
	async function fetchData() {
		try {
            const res = await getLiveData(cropfield.farm_id, cropfield.field_id, cropfield.id);
            return res;
		} catch (error) {
			console.error('This is the error: ' + error.message);
		}
    }

    /*
        useEffect(): useEffect refreshes the render after a state has been updated
        and creates a timer to retrieve all fields after 10 seconds
    */
	useEffect(() => {
        setIsLoading(true);

		/*
            getData(): handle the loading icon state and call fetchData() to ensure the result is not empty
        */
		async function getData() {
			const res = await fetchData();
			if (res) {
                setLiveData(res)
            }
			setIsLoading(false);
        }

        /*
            setInterval(): creates a timer that fires after 10 minutes and refreshes the data from this cropfield card
        */
        const timer = setInterval(() => {
            setIsLoading(true);
            getData();
        }, 600000);

        getData();
        return () => clearInterval(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

    /*
        Loading: this component creates a loading icon while fetching data until complete to give feedback to the user
    */
    const Loading = () => {
        return <GridLoader css={'margin: 0 auto'} sizeUnit={'px'} size={10} color={'#E07A5F'} />;
    };

    /*
        Return: return creates the view where the cropfield card and its respective live data are shown if @state{isLoading} is false
        isLoading:
            true: show loading icon
            false: show cropfield card and its respective data
    */
    return (
        <Card
            className={clsx(classes.card, {
                [classes.cardExpand]: expanded
            })}
        >
            <CardHeader
                avatar={
                    <ExploreIcon htmlColor={getColor(cropfield.crop_type.id)} />
                }
                action={
                    <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label='show more'
                >
                    <ExpandMoreIcon />
                </IconButton>
                }
                title={cropfield.name}
                subheader={cropfield.crop_type.name}
            />
            <Divider />
            <Collapse in={expanded}  unmountOnExit>
            <CardContent className={classes.list}>
                {isLoading ?
                    <Loading />
                :
                    <React.Fragment>
                        {liveData.map((measurement: any, index: number) => (
                            <div key={index} className={classes.listItem}>
                                <span>{measurement.name}</span>
                                <span>{measurement.value + ' ' + measurement.unit}</span>
                            </div>
                        ))}
                    </React.Fragment>
                }
                </CardContent>
            </Collapse>
        </Card>
    )
}

export default CardComponent;
