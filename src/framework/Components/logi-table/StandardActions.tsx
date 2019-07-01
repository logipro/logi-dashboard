import React, { useState, useEffect } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { rowActionsAndStates } from "./index";

interface editActionsAndStates extends rowActionsAndStates {
  saveChanges: () => any;
}

export function EditComp(props: editActionsAndStates) {
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
            props.saveChanges();
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

const EditButton = (props: any) => (
  <IconButton onClick={props.onClick} title="Edit row">
    <EditIcon />
  </IconButton>
);

export const DeleteButton = (props: any) => (
  <IconButton onClick={props.onClick} title="Delete row">
    <DeleteIcon />
  </IconButton>
);

export const CommitButton = (props: any) => (
  <IconButton onClick={props.onClick} title="Save changes">
    <SaveIcon />
  </IconButton>
);

export const CancelButton = (props: any) => (
  <IconButton color="secondary" onClick={props.onClick} title="Cancel changes">
    <CancelIcon />
  </IconButton>
);

export const FailedButton = (props: any) => (
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
