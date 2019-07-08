import React, { useState, useEffect } from "react";
import { useAuth } from "../../framework/Contexts/AuthContext";
import {
  Grid,
  CircularProgress,
  IconButton,
  makeStyles,
  Theme,
  createStyles
} from "@material-ui/core";
import Widget from "./Widget";
import ReactDOM from "react-dom";
import Edit from "@material-ui/icons/Edit";
import Save from "@material-ui/icons/Save";

export interface IDashboardProps {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      overflowX: "hidden"
    }
  })
);

const Dashboard = function(props: IDashboardProps) {
  const classes = useStyles();
  const Auth: any = useAuth();
  const [isLoadingWidgets, setIsLoadingWidgets] = useState(false);
  const [widgets, setWidgets] = useState();

  useEffect(() => {
    async function fetchWidgets() {
      setIsLoadingWidgets(true);
      var url = `${process.env.REACT_APP_APIURL}dashboard/widgets`;
      let widgets = await Auth.AuthenticatedServerCall(url, "GET");
      setIsLoadingWidgets(false);
      setWidgets(
        widgets.sort(
          (
            widgetA: { WidgetOrder: number },
            widgetB: { WidgetOrder: number }
          ) => widgetA.WidgetOrder - widgetB.WidgetOrder
        )
      );
    }
    fetchWidgets();
  }, [Auth]);

  const [editMode, setEditMode] = useState(false);
  const [widgetsBeforeEdit, setWidgetsBeforeEdit] = useState();

  const saveLayout = async () => {
    try {
      const url = `${process.env.REACT_APP_APIURL}modifyUserWidgetLayout`;
      const response = await Auth.AuthenticatedServerCall(url, "POST", {
        Widgets: widgets
      });
      console.log(response);
      if (response == "saved") {
        setEditMode(false);
        setWidgetsBeforeEdit(undefined);
      } else {
        console.log(response);
        setEditMode(false);
        setWidgets(widgetsBeforeEdit);
        throw new Error("Something went wrong ...");
      }
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={2} justify="center" alignItems="flex-start">
        {widgets && !isLoadingWidgets
          ? //if edit mode is true then we render all accessible widgets for user
            widgets
              .filter(
                (w: any) =>
                  w.IsVisible === true || w.IsVisible === 1 || editMode
              )
              .map((widget: any) => {
                return (
                  <Widget
                    tag={widget.Component}
                    key={widget.WidgetID}
                    widgetID={widget.WidgetID}
                    widgetInfo={widget}
                    EditMode={editMode}
                    toggleVisibility={() => {
                      const modifiedWidgets = widgets.map((w: any) => {
                        if (w.WidgetID === widget.WidgetID) {
                          return { ...w, IsVisible: !w.IsVisible };
                        }
                        //else
                        return w;
                      });
                      setWidgets(modifiedWidgets);
                    }}
                    changeWidgetOrder={(direction: number) => {
                      const modifiedWidgets = widgets
                        .map((w: any) => {
                          if (w.WidgetID === widget.WidgetID) {
                            return {
                              ...w,
                              WidgetOrder: w.WidgetOrder + direction
                            };
                          }
                          //else
                          return w;
                        })
                        .sort(
                          (
                            widgetA: { WidgetOrder: number },
                            widgetB: { WidgetOrder: number }
                          ) => widgetA.WidgetOrder - widgetB.WidgetOrder
                        )
                        .map((widget: any, index: any) => ({
                          ...widget,
                          WidgetOrder: index
                        }));
                      setWidgets(modifiedWidgets);
                    }}
                  />
                );
              })
          : null}
        {isLoadingWidgets ? <CircularProgress color="secondary" /> : null}
      </Grid>
      {Auth.LoggedInUserID >= 0 ? (
        <DashboardEdit
          editModeChanged={() => {
            if (editMode) {
              setEditMode(false);
              setWidgets(widgetsBeforeEdit);
            } else {
              setEditMode(true);
              setWidgetsBeforeEdit(widgets);
            }
          }}
          editMode={editMode}
          modifyUserWidgetLayout={() => {
            saveLayout();
          }}
        />
      ) : null}
    </div>
  );
};

export default Dashboard;

const appBarCmdDiv = document.getElementById("AppCmdBar");

function DashboardEdit(props: any) {
  return ReactDOM.createPortal(
    <React.Fragment>
      {props.editMode ? (
        <IconButton aria-label="save" onClick={props.modifyUserWidgetLayout}>
          <Save />
        </IconButton>
      ) : null}
      <IconButton
        color={props.editMode ? "secondary" : "inherit"}
        aria-label="edit"
        onClick={props.editModeChanged}
      >
        <Edit />
      </IconButton>
    </React.Fragment>,
    //@ts-ignore
    appBarCmdDiv
  );
}
