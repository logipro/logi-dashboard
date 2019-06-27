import React, { useState, useEffect } from "react";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { TableColumn } from "./LogiTable";
import { Checkbox } from "@material-ui/core";
import EditableTableCell from "./EditableTableCell";

//import { Value2SQLValue } from "./Value2SQLValue";
//import EditableTableCell from "./EditableTableCell";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rowStyle: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.background.default
      }
    },
    progress: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2)
    }
  })
);

export function LogiDataRow(props: {
  columns: Array<TableColumn>;
  index: number;
  allowSelection?: boolean;
  row?: any;
  addNewRecord?: (newRow: any) => Promise<boolean>;
  editRecord?: (oldRow: any, newRow: any) => Promise<boolean>;
  deleteRecord?: (oldRow: any) => Promise<boolean>;
  addingNewRowCanceled?: () => void;
}) {
  const allowEdit = props.editRecord ? true : false;
  const allowAddNew = props.addNewRecord ? true : false;
  const allowDelete = props.deleteRecord ? true : false;
  const classes = useStyles();
  const { columns, index } = props;
  const labelId = `enhanced-table-checkbox-${index}`;

  const [deleted, setDeleted] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [actionSuccess, setactionSuccess] = useState<boolean | undefined>(
    undefined
  );
  const [editMode, setEditMode] = useState(false);
  const [newlyAdded, setNewlyAdded] = useState(false);

  const [row, setRow] = useState(props.row);
  useEffect(() => {
    setRow(props.row);
  }, [props.row]);
  function changeValue(value: any, columnName: string) {
    var editedRow = { ...row };
    editedRow[columnName] = value;
    setRow(editedRow);
  }
  function resetRow() {
    setRow(props.row);
  }

  const [selected, setSelected] = useState<string[]>([]);

  const isSelected = (name: string) => selected.indexOf(name) !== -1;
  function handleClick(name: string) {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  }

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
      {newlyAdded ? (
        <TableCell>New</TableCell>
      ) : deleted ? (
        <TableCell>DELETED</TableCell>
      ) : actionInProgress ? (
        <TableCell>
          <CircularProgress size={30} className={classes.progress} />
        </TableCell>
      ) : actionSuccess && !actionSuccess ? (
        <TableCell>
          <FailedButton
            onExecute={() => {
              //reset the row to original row
              setEditMode(false);
              setactionSuccess(undefined);
              setActionInProgress(false);
              setDeleted(false);
              resetRow();
            }}
          />
        </TableCell>
      ) : editMode || props.addNewRecord ? (
        <TableCell padding={"checkbox"}>
          <CommitButton
            onExecute={() => {
              if (props.addNewRecord) {
                setActionInProgress(true);
                props
                  .addNewRecord(row)
                  .then(result => {
                    setactionSuccess(result);
                    setActionInProgress(false);
                    setEditMode(false);
                    setNewlyAdded(true);
                  })
                  .catch(e => {
                    console.log(e);
                    setactionSuccess(false);
                    setActionInProgress(false);
                    setEditMode(false);
                    resetRow();
                  });
              } else if (props.editRecord) {
                setActionInProgress(true);
                props
                  .editRecord(props.row, row)
                  .then(result => {
                    setactionSuccess(result);
                    setActionInProgress(false);
                    setEditMode(false);
                  })
                  .catch(e => {
                    console.log(e);
                    setactionSuccess(false);
                    setActionInProgress(false);
                    setEditMode(false);
                    resetRow();
                  });
              }
            }}
          />
          <CancelButton
            onExecute={() => {
              if (props.addNewRecord) {
                props.addingNewRowCanceled && props.addingNewRowCanceled();
              } else {
                //reset the row to original row
                setEditMode(false);
                resetRow();
              }
            }}
          />
        </TableCell>
      ) : allowEdit || allowDelete || allowAddNew ? (
        <TableCell padding={"checkbox"}>
          {allowEdit ? (
            <EditButton
              onExecute={() => {
                setEditMode(true);
              }}
            />
          ) : null}
          {allowDelete ? (
            <DeleteButton
              onExecute={() => {
                console.log("TODO:");
              }}
            />
          ) : null}
        </TableCell>
      ) : null}
      {columns
        .filter((c: TableColumn) => !c.hidden)
        .map((c: TableColumn, colIndex: number) => {
          if (colIndex === 0) {
            return (
              <TableCell
                key={`${c.accessor}${index}`}
                component="th"
                id={labelId}
                scope="row"
                padding="default"
              >
                {c.viewComponent ? (
                  c.viewComponent(row)
                ) : (
                  <EditableTableCell
                    column={c}
                    changeValue={(newValue: any) =>
                      changeValue(newValue, c.accessor)
                    }
                    dataRow={row}
                    editMode={editMode || (props.addNewRecord && !newlyAdded)}
                  />
                )}
              </TableCell>
            );
          } else
            return (
              <TableCell key={`${c.accessor}${index}`}>
                {c.viewComponent ? (
                  c.viewComponent(row)
                ) : (
                  <EditableTableCell
                    column={c}
                    changeValue={(newValue: any) =>
                      changeValue(newValue, c.accessor)
                    }
                    dataRow={row}
                    editMode={editMode || (props.addNewRecord && !newlyAdded)}
                  />
                )}
              </TableCell>
            );
        })}
    </TableRow>
  );
}

const EditButton = (props: any) => (
  <IconButton onClick={props.onExecute} title="Edit row">
    <EditIcon />
  </IconButton>
);

const DeleteButton = (props: any) => (
  <IconButton onClick={props.onExecute} title="Delete row">
    <DeleteIcon />
  </IconButton>
);

const CommitButton = (props: any) => (
  <IconButton onClick={props.onExecute} title="Save changes">
    <SaveIcon />
  </IconButton>
);

const CancelButton = (props: any) => (
  <IconButton
    color="secondary"
    onClick={props.onExecute}
    title="Cancel changes"
  >
    <CancelIcon />
  </IconButton>
);

const FailedButton = (props: any) => (
  <Button color="primary" onClick={props.onExecute} title="Action Failed">
    Failed!
  </Button>
);
