/* External imports */
import React from 'react';

/* Local imports */
import { ListItem, ListItemText, List } from '@material-ui/core';
import { DataColumn } from '../../../../common/DataColumn';

/*
    Renders the datamap table list that displays the datamap columns
*/
const DatamapTableList = (props: any) => {
    /*
        dataColumns: array of the datacolumns of this particular datamap
    */
	const dataColumns: Array<DataColumn> = props.dataColumns;

    /*
        Returns the DatamapTableList component
    */
	return (
        <div
            style={{
                overflowX: 'scroll',
                display: 'flex',
                marginLeft: 20
            }}
        >
			{dataColumns.map((dataColumn: DataColumn, index: number) => (
				<List key={index}>
                    {/* Column */}
                    <ListItem>
                        <ListItemText primary='Column' secondary={dataColumn.column} />
                    </ListItem>
                    {/* Type */}
                    <ListItem>
                        <ListItemText primary='Type' secondary={dataColumn.observation.type} />
                    </ListItem>
                    {/* Description */}
                    <ListItem>
                        <ListItemText primary='Description' secondary={dataColumn.observation.description} />
                    </ListItem>
                    {/* Context */}
                    <ListItem>
                        <ListItemText primary='Context' secondary={dataColumn.observation.context} />
                    </ListItem>
                    {/* Unit */}
                    <ListItem>
                        <ListItemText primary='Unit' secondary={dataColumn.observation.unit} />
                    </ListItem>
                    <List>
                        {/* Parameter */}
                        <ListItem>
                            <ListItemText primary='Parameter' secondary={dataColumn.observation.conditions[0].parameter} />
                        </ListItem>
                        {/* Value */}
                        <ListItem>
                            <ListItemText primary='Value' secondary={dataColumn.observation.conditions[0].value} />
                        </ListItem>
                        {/* Unit */}
                        <ListItem>
                            <ListItemText primary='Unit' secondary={dataColumn.observation.conditions[0].unit} />
                        </ListItem>
                    </List>
				</List>
			))}
		</div>
	);
};

export default DatamapTableList;
