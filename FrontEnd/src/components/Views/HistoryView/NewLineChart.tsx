/* External imports */
import React from 'react';

/* Libraries */
import { Line } from 'react-chartjs-2';
import { MDBContainer } from 'mdbreact';

/*
    Renders the randomized charts
*/
function ChartsPage(Props: any) {
    /*
        dataSets: contains the list of datasets for the graph
    */
	var dataSets;

    /*
        random(): function that returns a random number based on a maximum
        @param max: Maximum value of the random number generator
    */
	function random(max: any) {
		return Math.floor(Math.random() * Math.floor(max));
	}

	const buffer = Props.dataSets.map((data: any) => ({
		//The interface of a line in the graph
		label: data.name,
		fill: true,
		lineTension: 0.2,
		backgroundColor: 'rgba(225, 204,230, 0)',
		borderColor: 'rgb(' + random(255) + ', ' + random(225) + ',  ' + random(255) + ')',
		borderCapStyle: 'butt',
		borderDash: [],
		borderDashOffset: 0.0,
		borderJoinStyle: 'miter',
		pointBorderColor: 'rgb(205, 130,1 58)',
		pointBackgroundColor: 'rgb(255, 255, 255)',
		pointBorderWidth: 3,
		pointHoverRadius: 5,
		pointHoverBackgroundColor: 'rgb(0, 0, 0)',
		pointHoverBorderColor: 'rgba(220, 220, 220,1)',
		pointHoverBorderWidth: 2,
		pointRadius: 1,
		pointHitRadius: 10,
		data: data.data
	}));
	dataSets = buffer;

    // Lines of the graph with corresponding labels and datasets
	const graphLines = {
		dataLine: {
			labels: Props.xAxis,
			datasets: dataSets
		}
	};

    /*
        Returns the graph with the corresponding datasets
    */
	return (
		<MDBContainer>
			<h3 className='mt-5'>{Props.name}</h3>
			<Line data={graphLines.dataLine} options={{ responsive: true }} />
		</MDBContainer>
	);
}

export default ChartsPage;
