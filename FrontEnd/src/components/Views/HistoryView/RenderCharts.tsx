import React from "react";
import LineChart from './NewLineChart'
import { Paper } from '@material-ui/core';

export default function ChartsPage(props: any) {
    // variables used in this component
    // Start being the start date
    // End being end date
    // diff being the diffrence between the two dates.
    var start = props.start;
    var end = props.end;
    var diff = 0;

    // function to calculate the xaxis based on amount of days selected in the date inputs
    function xAxis() {
        if(start instanceof Date && end instanceof Date) {
            console.log(end.getTime()+"  :  "+start.getTime())
            diff = Math.floor(((end.getTime()-start.getTime())/(1000*60*60*24)));
            console.log(diff)
        } else {
            console.log("Error with instance of Date")
        }
        return Array.from(Array(diff).keys())
    };



    // Generate a dataset for each cropfield selected -- these are the lines in a graph
    function genDataSet() {
        var dataSet: any[] = [];

        props.selectedCropFields.forEach((cropfield: any) => (
            dataSet.push({name: "Line of cropfield "+cropfield, data: newData(5, cropfield/5)})
        ));

        return dataSet
    }

    // generate a data point for each point on the x Axis
    function newData(start: number, end: number) {
        var temp = new Array<number>();
        var rnd = 0;
        xAxis().forEach(() => {
            rnd = (Math.floor(Math.random() * end) + start)
            temp.push(rnd)
        });
        return temp;
    };

    // For every sensor selected render a graph
    return (
        props.sensor.map((sensor: any) => (
            <Paper style={{width: '80%', marginLeft: '10%', marginTop: '3%', marginBottom: '5%'}}>
                <LineChart dataSets={genDataSet()} xAxis={xAxis()} name={"Sensor ID: "+sensor}/>
            </Paper>
        ))
     )
};
