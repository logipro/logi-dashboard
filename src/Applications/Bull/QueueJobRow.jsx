import React from "react";
import { makeStyles } from "@material-ui/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ReactJson from "react-json-view";
import DeleteIcon from "@material-ui/icons/Delete";
import RecordVoiceOverIcon from "@material-ui/icons/RecordVoiceOver";
import RedoIcon from "@material-ui/icons/Redo";
import Tooltip from "@material-ui/core/Tooltip";
import { useAuth } from "../../framework/Contexts/AuthContext";
import clsx from "clsx";

const useStyles = makeStyles(theme => {
  const transition = {
    duration: theme.transitions.duration.shortest
  };
  return {
    expanded: {},
    expandIcon: {
      transform: " rotate(0deg)",
      transition: theme.transitions.create("transform", transition),
      "&:hover": {
        // Disable the hover effect for the IconButton
        backgroundColor: "transparent"
      },
      "&$expanded": {
        transform: "rotate(180deg)"
      }
    },
    detailsSection: {
      padding: "5px"
    },
    actions: {
      display: "flex"
    }
  };
});

function QueueJobRow(props) {
  const Auth = useAuth();
  const { row } = props;
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  async function jobAction(jobID, operation) {
    const url = `${
      process.env.REACT_APP_TASK_MANAGEMENT_URL
    }queues/job/operation`;
    await Auth.AuthenticatedServerCall(
      url,
      "POST",
      {
        queueName: props.queueName,
        jobID,
        operation
      },
      `Job ${operation}ed`
    );
    props.requestRefresh();
  }

  return (
    <React.Fragment>
      <TableRow key={row.id}>
        <TableCell component="th" scope="row">
          <IconButton
            className={clsx(classes.expandIcon, {
              [classes.expanded]: expanded
            })}
            component="div"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setExpanded(!expanded)}
          >
            <ExpandMoreIcon />
          </IconButton>
        </TableCell>
        <TableCell>{row.id}</TableCell>
        <TableCell align="right">
          {new Date(row.timestamp).toLocaleString()}
        </TableCell>
        <TableCell align="right">
          {row.processedOn
            ? `${Math.round((row.processedOn - row.timestamp) / 1000)} Secs`
            : ""}
        </TableCell>
        <TableCell align="right">
          {row.processedOn ? new Date(row.processedOn).toLocaleString() : ""}
        </TableCell>
        <TableCell align="right">
          {row.finishedOn ? new Date(row.finishedOn).toLocaleString() : ""}
        </TableCell>
        <TableCell align="right">
          {row.finishedOn
            ? `${Math.round((row.finishedOn - row.processedOn) / 1000)} Secs`
            : ""}
        </TableCell>
        <TableCell align="right">
          {row.opts ? row.opts.attempts : "NA"}
        </TableCell>
        <TableCell align="center">
          <div className={classes.actions}>
            {props.state !== "waiting" &&
            props.state !== "completed" &&
            props.state !== "active" ? (
              <Tooltip title="Retry job">
                <IconButton onClick={() => jobAction(row.id, "retry")}>
                  <RedoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : null}
            {props.state !== "running" && props.state !== "active" ? (
              <Tooltip title="Remove job">
                <IconButton onClick={() => jobAction(row.id, "remove")}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : null}
            {props.state === "delayed" ? (
              <Tooltip title="Promote job">
                <IconButton onClick={() => jobAction(row.id, "promote")}>
                  <RecordVoiceOverIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : null}
          </div>
        </TableCell>
      </TableRow>
      {expanded ? (
        <TableRow>
          <TableCell colSpan={9}>
            <Collapse in={expanded} unmountOnExit={true}>
              <div className={classes.detailsSection}>
                {row.data ? (
                  <ReactJson
                    src={row.data}
                    name={"data"}
                    enableClipboard={false}
                    displayObjectSize={false}
                    displayDataTypes={false}
                  />
                ) : null}
                {row.returnvalue ? (
                  <ReactJson
                    src={row.returnvalue}
                    name={"Return Value"}
                    enableClipboard={false}
                    displayObjectSize={false}
                    displayDataTypes={false}
                  />
                ) : null}
                {row.stacktrace && row.stacktrace.length > 0 ? (
                  <ReactJson
                    src={row.stacktrace}
                    name={"Stack Trace"}
                    enableClipboard={false}
                    displayObjectSize={false}
                    displayDataTypes={false}
                  />
                ) : null}
                {row.failedReason && row.failedReason.length > 0 ? (
                  <ReactJson
                    src={{ reason: row.failedReason }}
                    name={"Reason for Failure"}
                    enableClipboard={false}
                    displayObjectSize={false}
                    displayDataTypes={false}
                  />
                ) : null}
              </div>
            </Collapse>
          </TableCell>
        </TableRow>
      ) : null}
    </React.Fragment>
  );
}

export default QueueJobRow;
