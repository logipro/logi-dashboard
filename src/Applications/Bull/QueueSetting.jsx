import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/styles";
import { AppBar, Tabs, Tab, Typography } from "@material-ui/core";
import { useAuth } from "../../framework/Contexts/AuthContext";

const useStyles = makeStyles(theme => ({
  tabContainer: {
    padding: "6px",
    margin: "5px"
  },
  buttonsContainer: {
    padding: "6px",
    display: "flex",
    justifyContent: "center",
    margin: "5px"
  },
  margin: {
    margin: theme.spacing(2)
  }
}));

function QueueSetting(props) {
  const Auth = useAuth();
  const classes = useStyles();
  const [setting, setSetting] = useState({});
  const [disableButtons, setDisableButtons] = useState(true);
  const [focusedTab, setFocusedTab] = useState(0);
  function modifySettings(newSetting) {
    setSetting(newSetting);
    setDisableButtons(false);
  }
  async function getQueueSetting(queueName) {
    try {
      const url = `${
        process.env.REACT_APP_TASK_MANAGEMENT_URL
      }queues/setting/${queueName}`;
      const fetchedQueueSetting = await Auth.AuthenticatedServerCall(
        url,
        "GET"
      );
      setSetting(fetchedQueueSetting);
    } catch (error) {
      console.log({ error, loading: false });
    }
  }
  useEffect(() => {
    getQueueSetting(props.queueName);
  }, []);

  async function changeQueueSetting(queueName, newSetting) {
    const url = `${
      process.env.REACT_APP_TASK_MANAGEMENT_URL
    }queues/setting/update/${queueName}`;
    await Auth.AuthenticatedServerCall(
      url,
      "POST",
      { queueSetting: newSetting },
      "queue setting changed"
    );
    setDisableButtons(true);
  }

  return (
    <React.Fragment>
      <div>
        <AppBar position="static">
          <Tabs
            value={focusedTab}
            onChange={(event, newValue) => {
              setFocusedTab(newValue);
            }}
          >
            <Tab label="Settings" />
            <Tab label="Workers" />
            <Tab label="Schedules" />
          </Tabs>
        </AppBar>
      </div>
      <div className={classes.tabContainer}>
        {focusedTab === 0 ? (
          <React.Fragment>
            <ReactJson
              name={false}
              src={setting}
              onEdit={e => {
                modifySettings(e.updated_src);
              }}
              onDelete={e => {
                modifySettings(e.updated_src);
              }}
              onAdd={e => {
                modifySettings(e.updated_src);
              }}
            />
            <div className={classes.buttonsContainer}>
              <Button
                variant="contained"
                color="secondary"
                className={classes.margin}
                disabled={disableButtons}
                onClick={() => changeQueueSetting(props.queueName, setting)}
              >
                Save Changes
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={classes.margin}
                disabled={disableButtons}
                onClick={() => {
                  getQueueSetting(props.queueName);
                  setDisableButtons(true);
                }}
              >
                Discard Changes
              </Button>
            </div>
          </React.Fragment>
        ) : null}
        {focusedTab === 1 ? (
          <QueueOperationalDetails
            queueName={props.queueName}
            operation={"getWorkers"}
            Auth={Auth}
          />
        ) : null}
        {focusedTab === 2 ? (
          <QueueOperationalDetails
            queueName={props.queueName}
            operation={"getRepeatableJobs"}
            Auth={Auth}
          />
        ) : null}
      </div>
    </React.Fragment>
  );
}

export default QueueSetting;

function QueueOperationalDetails(props) {
  const [operationSetting, setOperationSetting] = useState({});

  async function getQueueOperationalSetting() {
    try {
      const url = `${
        process.env.REACT_APP_TASK_MANAGEMENT_URL
      }queues/operation/${props.queueName}&${props.operation}`;
      const fetchedQueueSetting = await props.Auth.AuthenticatedServerCall(
        url,
        "GET"
      );
      setOperationSetting(fetchedQueueSetting);
    } catch (error) {
      console.log({ error, loading: false });
    }
  }
  useEffect(() => {
    getQueueOperationalSetting();
  }, []);

  return (
    <React.Fragment>
      {operationSetting.result !== undefined &&
      operationSetting.result.length >= 1 ? (
        <ReactJson
          name={false}
          src={operationSetting.result}
          onEdit={false}
          onDelete={false}
          onAdd={false}
          enableClipboard={false}
          displayObjectSize={false}
          displayDataTypes={false}
        />
      ) : (
        <Typography>Nothing found!</Typography>
      )}
    </React.Fragment>
  );
}
