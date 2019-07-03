import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { rowActionsAndStates } from "./index";
import {
  makeStyles,
  Theme,
  createStyles,
  CircularProgress
} from "@material-ui/core";

export interface IStandardActionsAndStates extends rowActionsAndStates {
  actionInProgress?: boolean;
  saveChanges?: () => any;
  deleteRecord?: () => any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    progress: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2)
    }
  })
);

export function StandardActions(props: IStandardActionsAndStates) {
  const classes = useStyles();
  if (props.actionInProgress) {
    return <CircularProgress size={30} className={classes.progress} />;
  }
  if (props.editMode) {
    return <EditComp {...props} />;
  }
  return (
    <>
      {props.saveChanges !== undefined ? <EditComp {...props} /> : null}
      {props.deleteRecord !== undefined ? <DeleteComp {...props} /> : null}
    </>
  );
}

export function EditComp(props: IStandardActionsAndStates) {
  if (!props.editMode) {
    return (
      <EditButton
        onClick={() => {
          props.enterEditMode();
        }}
      />
    );
  } else {
    return (
      <>
        <CommitButton
          onClick={(e: any) => {
            props.saveChanges && props.saveChanges();
          }}
        />
        <CancelButton
          onClick={() => {
            props.discardEditMode();
          }}
        />
      </>
    );
  }
}
export function DeleteComp(props: IStandardActionsAndStates) {
  return (
    <DeleteButton onClick={() => props.deleteRecord && props.deleteRecord()} />
  );
}

const EditButton = (props: any) => (
  <IconButton onClick={props.onClick} title="Edit row">
    <EditIcon />
  </IconButton>
);

const DeleteButton = (props: any) => (
  <IconButton onClick={props.onClick} title="Delete row">
    <DeleteIcon />
  </IconButton>
);

const CommitButton = (props: any) => (
  <IconButton onClick={props.onClick} title="Save changes">
    <SaveIcon />
  </IconButton>
);

const CancelButton = (props: any) => (
  <IconButton color="secondary" onClick={props.onClick} title="Cancel changes">
    <CancelIcon />
  </IconButton>
);

const FailedButton = (props: any) => (
  <Button color="primary" onClick={props.onClick} title="Action Failed">
    Failed!
  </Button>
);

/*export function StandardActions(props:any){
      return ({newlyAdded ? (
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
            onClick={() => {
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
            onClick={() => {
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
            onClick={() => {
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
              onClick={() => {
                setEditMode(true);
              }}
            />
          ) : null}
          {allowDelete ? (
            <DeleteButton
              onClick={() => {
                console.log("TODO:");
              }}
            />
          ) : null}
        </TableCell>
      ) : null})
  }*/
