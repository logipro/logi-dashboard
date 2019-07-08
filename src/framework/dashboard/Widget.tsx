import Grid from "@material-ui/core/Grid";
import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import Add from "@material-ui/icons/Add";
import Remove from "@material-ui/icons/Remove";
import ArrowBack from "@material-ui/icons/ArrowBack";
import ArrowForward from "@material-ui/icons/ArrowForward";
import InfoCard from "./Cards/InfoCard";
import StatementCard from "./Cards/StatementCard";
import FigureCard from "./Cards/FigureCard";

const components: any = {
  FigureCard: { component: FigureCard, xs: 12, md: 6, sm: 12 },
  //StatsCard: { component: ConnectedStatsCard, xs: 12, md: 6, sm: 12 },
  //ChartCard: { component: ConnectedChartCard, xs: 12, md: 6, sm: 12 },
  StatementCard: {
    component: StatementCard,
    xs: 12,
    md: 6,
    sm: 12
  },
  InfoCard: {
    component: InfoCard,
    xs: 6,
    md: 3,
    sm: 6
  }
};
//import all dashboard Widgets here and add them to the list of components
function Widget(props: {
  tag: string;
  EditMode: boolean;
  widgetInfo: { IsVisible: any };
  toggleVisibility: () => void;
  widgetID: number;
  changeWidgetOrder: (direction: number) => void;
}) {
  const TagName = components[props.tag].component;

  return (
    <Grid
      item
      xs={components[props.tag].xs}
      sm={components[props.tag].sm}
      md={components[props.tag].md}
    >
      {props.EditMode ? (
        <>
          <span>
            {props.widgetInfo.IsVisible ? (
              <IconButton
                color={"secondary"}
                onClick={() => props.toggleVisibility()}
              >
                <Remove />
              </IconButton>
            ) : (
              <IconButton
                color={"primary"}
                onClick={() => props.toggleVisibility()}
              >
                <Add />
              </IconButton>
            )}
            <IconButton
              onClick={() =>
                //send back and forth by 2 so the widget will move before/after the adjacent one
                props.changeWidgetOrder(-2)
              }
            >
              <ArrowBack />
            </IconButton>
            <IconButton
              onClick={() =>
                //send back and forth by 2 so the widget will move before/after the adjacent one
                props.changeWidgetOrder(+2)
              }
            >
              <ArrowForward />
            </IconButton>
          </span>
          <TagName
            widgetID={props.widgetID}
            widgetInfo={props.widgetInfo}
            EditMode={props.EditMode}
          />
        </>
      ) : (
        <TagName
          widgetID={props.widgetID}
          widgetInfo={props.widgetInfo}
          EditMode={props.EditMode}
        />
      )}
    </Grid>
  );
}

export default Widget;
