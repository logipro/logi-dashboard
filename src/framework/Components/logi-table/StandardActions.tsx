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
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

export interface IStandardActionsAndStates extends rowActionsAndStates {
  /**
   *True when a delete or Save is in progress
   *
   * @type {boolean}
   * @memberof IStandardActionsAndStates
   */
  actionInProgress?: boolean;
  /**
   * Will be fired when Save button is clicked,
   * if exists Edit button will be displayed
   * @memberof IStandardActionsAndStates
   */
  saveChanges?: () => any;
  /**
   *Will be fired when delete button is clicked
   * if exists Delete icon will be displayed
   * @memberof IStandardActionsAndStates
   */
  deleteRecord?: () => any;
  /**
   * The component that you expect to be displayed in details panel
   *
   * @type {React.ReactElement}
   * @memberof IStandardActionsAndStates
   */
  expandComp?: React.ReactElement;
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
      {props.expandComp !== undefined ? <ExpandDetail {...props} /> : null}
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

export function ExpandDetail(props: IStandardActionsAndStates) {
  if (props.isExpanded) {
    return (
      <IconButton
        onClick={() => {
          props.collapse && props.collapse();
        }}
      >
        <ExpandLessIcon />
      </IconButton>
    );
  } else {
    return (
      <IconButton
        onClick={() => {
          props.expandComp && props.expand(props.expandComp);
        }}
      >
        <ExpandMoreIcon />
      </IconButton>
    );
  }
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
