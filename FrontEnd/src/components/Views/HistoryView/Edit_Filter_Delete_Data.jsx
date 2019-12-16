import React from 'react';
import MaterialTable from 'material-table';



export default function MaterialTableDemo(Props) {


  

  const [state, setState] = React.useState({
    columns: [
      { title: 'Start date', field: 'start_date' },
      { title: 'Start time', field: 'start_time' },
      { title: 'End date', field: 'end_date' },
      { title: 'End time', field: 'end_time' },

      { title: 'Field', field: 'field' },
      { title: 'Crop field', field: 'crop_field' },
      { title: 'Type', field: 'type' },
      { title: 'Crop type', field: 'crop_type' },
      { title: 'Sensor', field: 'sensor' },
      { title: 'Soil Type', field: 'soil_type' }


    ],
    
    // when we get the data from the backend, we map its attributes to the drop down buttons
    data: [

      {
        start_date: '18/04/1998',
        start_time: '13:30',
        end_date: '25/09/2019',
        end_time: '17:30',
        field: 'Joyful field',
        crop_field: 'White Crop Field',
        type: 'Winter',
        crop_type: 'Potatoes',
        sensor: 'Temperature Sensor',
        soil_type: 'Clay',
      },

      {
        start_date: '25/05/2001',
        start_time: '10:30',
        end_date: '25/09/2019',
        end_time: '17:30',
        field: 'White field',
        crop_field: 'White Crop Field',
        type: 'Winter',
        crop_type: 'Potatoes',
        sensor: 'Temperature Sensor',
        soil_type: 'Sand',
      }

    ],


  });


  return (
    <MaterialTable
      title="Editable Example"
      columns={state.columns}
      data={state.data}
      editable={{
        onRowAdd: newData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const data = [...state.data];
              data.push(newData);
              setState({ ...state, data });
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const data = [...state.data];
              data[data.indexOf(oldData)] = newData;
              setState({ ...state, data });
            }, 600);
          }),
        onRowDelete: oldData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const data = [...state.data];
              data.splice(data.indexOf(oldData), 1);
              setState({ ...state, data });
            }, 600);
          }),
      }}
      options={{
      filtering: true
    }}
    />
  );
}