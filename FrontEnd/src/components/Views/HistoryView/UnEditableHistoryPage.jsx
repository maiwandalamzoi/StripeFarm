import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
/**
 * @param columns this variable holds the oclumn name for this table
 */
const columns = [
  { id: 'mstype', label: 'Measurement Type', minWidth: 450 },
  { id: 'msvalue', label: 'Value', minWidth: 1 },
  { id: 'msunit', label: 'Unit', minWidth: 1 }
];
/**
 * the create data functoin parses the data
 * to such a layout that it is usable by the table
 */
function createData(mstype, msvalue, msunit) {
  return {mstype, msvalue, msunit};
}

// extract data from the API (concrete examples for now)
const entries = [
    {mstype: 'Temperature', msvalue: '30', msunit: 'Fahrenheit'},
    {mstype: 'Humidity', msvalue: '60', msunit: '%'}
  ];
  /**
   * @param rows The rows parameter contains the entries for the table
   */
const rows = formArray(entries)

// maps the data from Dacom and StripeFarmer to the table
function formArray(entries) {
    const attributes = entries.map((entry) => createData(entry.mstype, entry.msvalue, entry.msunit));
    return attributes
  }
  /**
   * @param useStyles creates the styles that will be used by the material table
   * the root sets the width of the table
   * and the table wrapper specifies its maximum heigh as well as what happens
   * when the table overflows
   */
const useStyles = makeStyles({
  root: {
    width: '50%',
  },
  tableWrapper: {
    maxHeight: 407,
    overflow: 'auto',
  },
});
/**
 * StickyHeadTable
 * this function creates a table that can be used on the history page
 * this shows data, however it is not editable
 * @param classes this creates a variable with the style
 * @param page this loads the page
 * @param rowsPerPage this sets how many rows are shown per page.
 */
export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  /**
   * handleChangePage
   * This functoin handles the change on a page
   * and sets the page to the next one
   */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  /**
   * handleChangeRowsPerPage
   * this function changes the rows per page
   * and sets the current page
   */
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  /**
   * This returns the UI elements of the table
   * It create a header fo the table
   * and creates a row per data entry
   * It also creates a body for the table
   * and it creates a pagnation for the table 
   */
  return (
    <Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map(column => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          'aria-label': 'previous page',
        }}
        nextIconButtonProps={{
          'aria-label': 'next page',
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
