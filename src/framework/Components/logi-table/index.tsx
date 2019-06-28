import React, { useState, useEffect, useReducer } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { LogiTableHeader } from "./LogiTableHeader";
import { LogiDataRow } from "./LogiDataRow";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { CircularProgress } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      marginTop: theme.spacing(3)
    },
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2)
    },
    table: {
      minWidth: 750
    },
    tableWrapper: {
      overflowX: "auto"
    },
    progress: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2)
    }
  })
);

export type Order = "asc" | "desc";
export type DataType =
  | "String"
  | "Number"
  | "Date"
  | "DateTime"
  | "Time"
  | "Boolean"
  | "ActionColumn";

export interface TableColumn {
  header: string;
  disablePadding?: boolean;
  accessor: string;
  dataType: DataType;
  readOnly?: boolean;
  hidden?: boolean;
  viewComponent?: (rowData: any) => React.ReactElement;
}

export interface LogiTableProps {
  keyAccessor: string;
  columns: Array<TableColumn>;
  data: Array<{}> | (() => Promise<Array<{}>>);
  allowSelection?: boolean;
  showSelectAll?: boolean;
  allowSort?: boolean;
  addNewRecord?: (newRow: any) => Promise<boolean>;
  editRecord?: (oldRow: any, newRow: any) => Promise<boolean>;
  deleteRecord?: (oldRow: any) => Promise<boolean>;
  customSortFunction?: (
    event: React.MouseEvent<unknown>,
    property: TableColumn
  ) => void;
  onSelectAllClick?: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
  dense?: boolean;
}

export function LogiTable(props: LogiTableProps) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([{}]);
  const [isError, setIsError] = useState(false);
  const [addingNewRecord, setAddingNewRecord] = useState(false);

  useEffect(() => {
    console.log("setting data");
    //get data if passed as promise
    if (typeof props.data === "function") {
      let fetchData: () => Promise<Array<{}>> = props.data as () => Promise<
        Array<{}>
      >;
      setIsLoading(true);
      fetchData()
        .then((fetchedData: Array<{}>) => {
          setData(fetchedData);
          setIsLoading(false);
        })
        .catch((c: any) => {
          console.log("error: " + c);
          setIsLoading(false);
          setIsError(true);
        });
    } else {
      setData(props.data);
      setIsLoading(false);
    }
  }, [props.data]);

  function handleChangePage(_event: unknown, newPage: number) {
    setPage(newPage);
    console.log(
      data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    );
  }

  function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(+event.target.value);
  }

  const emptyRows =
    rowsPerPage -
    (data ? Math.min(rowsPerPage, data.length - page * rowsPerPage) : 0);

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <div className={classes.tableWrapper}>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={props.dense ? "small" : "medium"}
            >
              <LogiTableHeader
                {...props}
                addingNewRecord={() => {
                  setAddingNewRecord(true);
                }}
                allowEdit={props.editRecord ? true : false}
                allowAddNew={props.addNewRecord ? true : false}
                allowDelete={props.deleteRecord ? true : false}
              />
              <TableBody>
                {addingNewRecord && (
                  <LogiDataRow
                    key={-1}
                    row={() => {
                      let newRecord: any = {};
                      props.columns.forEach((col: TableColumn) => {
                        newRecord[col.accessor] = "";
                      });
                      return newRecord;
                    }}
                    index={-1}
                    columns={props.columns}
                    allowSelection={false}
                    addingNewRowCanceled={() => {
                      setAddingNewRecord(false);
                    }}
                    addNewRecord={props.addNewRecord}
                  />
                )}
                {isLoading || isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={
                        props.columns.filter((c: TableColumn) => !c.hidden)
                          .length
                      }
                      rowSpan={rowsPerPage}
                      align={"center"}
                    >
                      <div>
                        {isLoading ? (
                          <CircularProgress
                            size={30}
                            className={classes.progress}
                          />
                        ) : (
                          "Failed to load data!"
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data && //making sure data is available
                  data.length > 0 &&
                  data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row: any, index: number) => {
                      return (
                        <LogiDataRow
                          key={index}
                          row={row}
                          index={index}
                          columns={props.columns}
                          allowSelection={props.allowSelection}
                          editRecord={props.editRecord}
                          deleteRecord={props.deleteRecord}
                          addNewRecord={props.addNewRecord}
                        />
                      );
                    })
                )}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell
                      colSpan={
                        props.columns.filter((c: TableColumn) => !c.hidden)
                          .length
                      }
                    />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data ? data.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              "aria-label": "Previous Page"
            }}
            nextIconButtonProps={{
              "aria-label": "Next Page"
            }}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </MuiPickersUtilsProvider>
  );
}
