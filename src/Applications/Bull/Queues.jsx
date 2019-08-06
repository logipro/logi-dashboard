import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Tabs, Tab, AppBar, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Refresh from "@material-ui/icons/Refresh";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import ToggleButton from "@material-ui/lab/ToggleButton";
import SettingsIcon from "@material-ui/icons/Settings";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import QueueJob from "./QueueJob";
import QueueSetting from "./QueueSetting";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import Tooltip from "@material-ui/core/Tooltip";
import { useAuth } from "../../framework/Contexts/AuthContext";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0
  },
  expansionPanel: {
    width: "100%",
    justifyContent: "space-between",
    display: "flex",
    alignItems: "center"
  },
  expansionPanelDetails: {
    width: "100%",
    display: "block"
  },
  queueControls: {
    width: "100%",
    justifyContent: "flex-end",
    display: "flex",
    alignItems: "center"
  },
  margin: {
    margin: theme.spacing.length * 2
  },
  padding: {
    padding: `0 ${theme.spacing.length * 2}px`
  },
  toggleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    background: theme.palette.background.default
  }
}));

const queueTabs = [
  "waiting",
  "active",
  "completed",
  "failed",
  "delayed",
  "paused"
];

function QueueManagement() {
  const Auth = useAuth();
  async function getQueues() {
    try {
      //because we going to a different Path first validate the token vs main server
      var url = `${process.env.REACT_APP_APIURL}validateToken`;
      let isValid = await Auth.AuthenticatedServerCall(url, "POST", {
        username: `${Auth.LoggedInUserName}`,
        userID: `${Auth.LoggedInUserID}`
      });
      console.log(isValid);
      if (isValid) {
        const url = `${process.env.REACT_APP_TASK_MANAGEMENT_URL}queues`;
        const q = await Auth.AuthenticatedServerCall(url, "GET");
        setQueues(q.results);
        setRefreshDetails(!refreshDetails);
      }
    } catch (error) {
      console.log({ error, loading: false });
    }
  }

  const classes = useStyles();
  const [expanded, setExpanded] = useState(null);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const [queues, setQueues] = useState();
  const [focusedTab, setFocusedTab] = useState(0);
  const [showSettings, setShowSettings] = useState({});
  const [refreshDetails, setRefreshDetails] = useState(true);
  const [childRefreshRequest, setChildRefreshRequest] = useState();

  useEffect(() => {
    getQueues();
  }, [childRefreshRequest]);

  return (
    <React.Fragment>
      <div className={classes.root}>
        {queues !== undefined && queues.length && queues.length > 0
          ? queues.map(q => {
              console.log(q);
              return (
                <ExpansionPanel
                  expanded={expanded === q.name}
                  onChange={handleChange(q.name)}
                  key={q.name}
                >
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <div id="containerDiv" className={classes.expansionPanel}>
                      <Typography className={classes.heading}>
                        {q.name}
                      </Typography>
                      <div id="queueControls" className={classes.queueControls}>
                        {q.status !== " Disabled"
                          ? queueTabs.map(qt =>
                              q[qt] > 0 ? (
                                <Chip
                                  color={
                                    qt === "failed" ? "secondary" : "primary"
                                  }
                                  key={qt}
                                  avatar={
                                    <Avatar>
                                      {`${qt.substring(0, 1).toUpperCase()}`}
                                    </Avatar>
                                  }
                                  label={q[qt]}
                                />
                              ) : null
                            )
                          : null}
                        <div className={classes.toggleContainer}>
                          {q.status !== "Disabled" ? (
                            <React.Fragment>
                              <IconButton
                                onClick={async e => {
                                  e.stopPropagation();
                                  //because we going to a different Path first validate the token vs main server
                                  const url = `${
                                    process.env.REACT_APP_APIURL
                                  }validateToken`;
                                  let isValid = await Auth.AuthenticatedServerCall(
                                    url,
                                    "POST",
                                    {
                                      username: `${Auth.LoggedInUserName}`,
                                      userID: `${Auth.LoggedInUserID}`
                                    }
                                  );
                                  if (isValid) {
                                    const url = `${
                                      process.env.REACT_APP_TASK_MANAGEMENT_URL
                                    }queues/resume/${q.name}`;
                                    await Auth.AuthenticatedServerCall(
                                      url,
                                      "POST"
                                    );
                                    //refresh
                                    getQueues();
                                  }
                                }}
                                disabled={q.status === "Running"}
                              >
                                <PlayArrowIcon />
                              </IconButton>
                              <IconButton
                                onClick={async e => {
                                  e.stopPropagation();
                                  //because we going to a different Path first validate the token vs main server
                                  var url = `${
                                    process.env.REACT_APP_APIURL
                                  }validateToken`;
                                  let isValid = await Auth.AuthenticatedServerCall(
                                    url,
                                    "POST",
                                    {
                                      username: `${Auth.LoggedInUserName}`,
                                      userID: `${Auth.LoggedInUserID}`
                                    }
                                  );
                                  if (isValid) {
                                    const url = `${
                                      process.env.REACT_APP_TASK_MANAGEMENT_URL
                                    }queues/pause/${q.name}`;
                                    await Auth.AuthenticatedServerCall(
                                      url,
                                      "POST"
                                    );
                                    //refresh
                                    getQueues();
                                  }
                                }}
                                disabled={q.status === "Paused"}
                              >
                                <PauseIcon />
                              </IconButton>
                            </React.Fragment>
                          ) : null}
                          <ToggleButton
                            value="settings"
                            selected={showSettings[q.name]}
                            onClick={e => {
                              //---don't expand if already expanded
                              if (expanded === q.name) {
                                e.stopPropagation();
                              }
                              let clonedState = { ...showSettings };
                              clonedState[q.name] =
                                showSettings[q.name] !== undefined
                                  ? !showSettings[q.name]
                                  : true;
                              setShowSettings(clonedState);
                            }}
                          >
                            <SettingsIcon />
                          </ToggleButton>
                        </div>
                      </div>
                    </div>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails
                    className={classes.expansionPanelDetails}
                  >
                    {!showSettings[q.name] ? (
                      q.status !== "Disabled" ? (
                        <div>
                          <AppBar position="static">
                            <Tabs
                              value={focusedTab}
                              onChange={(event, newValue) => {
                                setFocusedTab(newValue);
                              }}
                            >
                              {queueTabs.map(qt => {
                                //paused queue jobs are shown in waiting list
                                if (qt !== "paused")
                                  return (
                                    <Tab
                                      key={qt}
                                      label={
                                        <Badge
                                          className={classes.padding}
                                          color="secondary"
                                          badgeContent={q[qt]}
                                        >
                                          {qt}
                                        </Badge>
                                      }
                                    />
                                  );
                                else return null;
                              })}
                            </Tabs>
                          </AppBar>
                          {queueTabs.map(qt =>
                            expanded === q.name &&
                            queueTabs[focusedTab] === qt ? (
                              <QueueJob
                                key={`${q.name}-${qt}`}
                                queueName={q.name}
                                jobsLength={q[qt]}
                                state={queueTabs[focusedTab]}
                                refresh={refreshDetails}
                                requestRefresh={() =>
                                  setChildRefreshRequest(!childRefreshRequest)
                                }
                              />
                            ) : null
                          )}
                        </div>
                      ) : (
                        <Typography>This Queue is disabled</Typography>
                      )
                    ) : (
                      <QueueSetting queueName={q.name} />
                    )}
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              );
            })
          : null}
      </div>
      <QueueToolbar
        onRefresh={() => getQueues()}
        onShutDown={async () => {
          //because we going to a different Path first validate the token vs main server
          var url = `${process.env.REACT_APP_APIURL}validateToken`;
          let isValid = await Auth.AuthenticatedServerCall(url, "POST", {
            username: `${Auth.LoggedInUserName}`,
            userID: `${Auth.LoggedInUserID}`
          });
          if (isValid) {
            const url = `${
              process.env.REACT_APP_TASK_MANAGEMENT_URL
            }queues/gracefulShutdown`;
            await Auth.AuthenticatedServerCall(url, "POST");
            //refresh
            getQueues();
          }
        }}
      />
    </React.Fragment>
  );
}

export default QueueManagement;

const appBarCmdDiv = document.getElementById("AppCmdBar");

function QueueToolbar(props) {
  return ReactDOM.createPortal(
    <React.Fragment>
      <Tooltip title="Refresh all Queues">
        <IconButton aria-label="refresh" onClick={e => props.onRefresh()}>
          <Refresh />
        </IconButton>
      </Tooltip>
      <Tooltip title="Pause all Queues">
        <IconButton aria-label="pause" onClick={e => props.onShutDown()}>
          <PowerSettingsNewIcon />
        </IconButton>
      </Tooltip>
    </React.Fragment>,
    appBarCmdDiv
  );
}
