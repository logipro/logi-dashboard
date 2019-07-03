import React from "react";
import {
  makeStyles,
  Theme,
  createStyles,
  Toolbar,
  IconButton
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { toolbarActionsAndState } from "./index";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1)
    },
    spacer: {
      flex: "1 1 100%"
    },
    actions: {
      color: theme.palette.text.secondary,
      flex: "0 0 auto"
    },
    title: {
      flex: "0 0 auto"
    }
  })
);

export const LogiTableToolbar = (props: {
  title?: string;
  actions?: React.ReactElement;
}) => {
  const classes = useStyles();

  return (
    <Toolbar className={classes.root}>
      <div className={classes.title}>{props.title}</div>
      <div className={classes.spacer} />
      <div className={classes.actions}>{props.actions}</div>
    </Toolbar>
  );
};

export const LogiStandardToolbar = (props: {
  title: string;
  actionsAndStates: toolbarActionsAndState;
  insertNewRecord: (recordData: any) => void;
}) => {
  let actions: React.ReactElement = <></>;
  if (props.insertNewRecord !== undefined) {
    actions = !props.actionsAndStates.insertMode ? (
      <IconButton
        color="secondary"
        onClick={props.actionsAndStates.enterInsertMode}
        title="Add Record"
      >
        <AddIcon />
      </IconButton>
    ) : (
      <>
        <IconButton
          onClick={() => {
            props.insertNewRecord(props.actionsAndStates.insertedRecordData());
          }}
          title="Save changes"
        >
          <SaveIcon />
        </IconButton>
        <IconButton
          color="secondary"
          onClick={props.actionsAndStates.discardInsertMode}
          title="Cancel changes"
        >
          <CancelIcon />
        </IconButton>
      </>
    );
  }

  return <LogiTableToolbar title={props.title} actions={actions} />;
};
