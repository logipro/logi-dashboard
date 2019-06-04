import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Header from "./framework/layout/Header";
import Sidebar from "./framework/layout/Sidebar";

const useStyle = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    overflow: "auto",
    position: "relative",
    float: "right",
    maxHeight: "100%",
    width: "100%",
    overflowScrolling: "touch"
  },
  appBarSpacer: theme.mixins.toolbar,
  paper: {
    margin: theme.spacing(1),
    padding: theme.spacing(2)
  }
}));

const App: React.FC = props => {
  let classes = useStyle();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  return (
    <div className={classes.root}>
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
      </main>
    </div>
  );
};

export default App;
