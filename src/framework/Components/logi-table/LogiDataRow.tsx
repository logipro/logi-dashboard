import React, { useState, useEffect } from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { TableColumn } from "./index";
import { Checkbox } from "@material-ui/core";
import EditableTableCell from "./EditableTableCell";

/**
 *
 *
 * @export
 * @interface rowActionsAndStates
 */
export interface rowActionsAndStates {
  /**
   *Call this function to put the row in edit mode status
   * @memberof rowActionsAndStates
   */
  enterEditMode: () => void;

  /**
   *Call this function to cancel the edit mode and return the row to reset status
   * @memberof rowActionsAndStates
   */
  discardEditMode: () => void;

  /**
   *true if the row is in edit mode
   * @type {boolean}
   * @memberof rowActionsAndStates
   */
  editMode: boolean;
  /**
   * Original row data
   * @type {*}
   * @memberof rowActionsAndStates
   */
  oldData: any;
  /**
   * New Row Data (if it's modified)
   * @type {*}
   * @memberof rowActionsAndStates
   */
  newData: any;
  /**
   * Use this to set the row Data for example when a row is edited successfully and you want to replace the data
   * without refreshing the whole content of the grid
   * Note that this will set the the data in state and not whole table prop. i.e. if the page changes the row will reset
   * BETTER OPTION IS TO REFRESH THE DATA FOR THE WHOLE GRID
   * @memberof rowActionsAndStates
   */
  setData: (data: any) => void;
  /**
   * True when the record is a newly added record (not added yet!)
   * @type {boolean}
   * @memberof rowActionsAndStates
   */
  insertMode: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rowStyle: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.background.default
      }
    }
  })
);

export function LogiDataRow(props: {
  columns: Array<TableColumn>;
  index: number;
  allowSelection?: boolean;
  row: any;
  insertMode?: boolean;
  /**
   * will be called everytime the record data is modified
   */
  setEditedRow?: (row: any) => void;
}) {
  const classes = useStyles();
  const { columns, index } = props;
  const labelId = `enhanced-table-checkbox-${index}`;
  const [editMode, setEditMode] = useState(false);

  const [row, setRow] = useState(props.row);
  useEffect(() => {
    setRow(props.row);
  }, [props.row]);

  function changeValue(value: any, columnName: string) {
    var editedRow = { ...row };
    editedRow[columnName] = value;
    setRow(editedRow);
    props.setEditedRow && props.setEditedRow(editedRow);
  }
  function resetRow() {
    setRow(props.row);
    props.setEditedRow && props.setEditedRow(props.row);
  }

  let rowStateAndAction: rowActionsAndStates = {
    enterEditMode: () => {
      setEditMode(true);
    },
    discardEditMode: () => {
      setEditMode(false);
      resetRow();
    },
    editMode: editMode || (props.insertMode ? props.insertMode : false),
    oldData: props.row,
    newData: row, // this will be modified data (in case user changes values)
    setData: (newData: any) => {
      setRow(newData);
    },
    insertMode: props.insertMode ? props.insertMode : false
  };

  return (
    <TableRow className={classes.rowStyle}>
      {props.allowSelection ? (
        <TableCell padding="checkbox">
          <Checkbox
            checked={false}
            inputProps={{ "aria-labelledby": labelId }}
          />
        </TableCell>
      ) : null}
      {columns
        .filter((c: TableColumn) => !c.hidden)
        .map((c: TableColumn, colIndex: number) => {
          if (colIndex === 0) {
            return (
              <TableCell
                key={`${c.accessor ? c.accessor : c.header}${index}`}
                component="th"
                id={labelId}
                scope="row"
                padding="default"
              >
                {props.insertMode &&
                c.dataType === "ActionColumn" ? null : c.viewComponent ? (
                  c.viewComponent(row, rowStateAndAction)
                ) : (
                  <EditableTableCell
                    column={c}
                    changeValue={(newValue: any) =>
                      changeValue(newValue, c.accessor)
                    }
                    dataRow={row}
                    editMode={editMode || props.insertMode}
                  />
                )}
              </TableCell>
            );
          } else
            return (
              <TableCell key={`${c.accessor ? c.accessor : c.header}${index}`}>
                {props.insertMode &&
                c.dataType === "ActionColumn" ? null : c.viewComponent ? (
                  c.viewComponent(row, rowStateAndAction)
                ) : (
                  <EditableTableCell
                    column={c}
                    changeValue={(newValue: any) =>
                      changeValue(newValue, c.accessor)
                    }
                    dataRow={row}
                    editMode={
                      editMode || (props.insertMode ? props.insertMode : false)
                    }
                  />
                )}
              </TableCell>
            );
        })}
    </TableRow>
  );
}
