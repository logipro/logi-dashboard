import React, { Suspense } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Header from "./framework/layout/Header";
import Sidebar from "./framework/layout/Sidebar";
import { Route, Switch } from "react-router-dom";
import { useAuth } from "./framework/Contexts/AuthContext";
import { Paper, Grid, Avatar, Typography } from "@material-ui/core";
import ErrorBoundary from "./framework/helpers/ErrorBoundary";

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
  const classes = useStyle();
  const Auth: any = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  return (
    <div className={classes.root}>
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        {Auth.AccessibleApps ? (
          <Switch>
            {Auth.AccessibleApps.map((app: any, key: any) => {
              if (
                app.Path &&
                app.Path !== "" &&
                app.Component &&
                app.Component !== ""
              ) {
                return (
                  <Route
                    exact
                    path={
                      app.Path +
                      `${
                        app.params !== undefined && app.params !== null
                          ? "/:param"
                          : ""
                      }`
                    }
                    render={() => (
                      <ErrorBoundary>
                        <DynamicLoader component={app.Component} />
                      </ErrorBoundary>
                    )}
                    key={key}
                  />
                );
              } else if (app.childApps) {
                var childRoutes = app.childApps.map((prop: any, key: any) => {
                  if (
                    prop.Path &&
                    prop.Path !== "" &&
                    prop.Component &&
                    prop.Component !== ""
                  ) {
                    return (
                      <Route
                        exact
                        path={
                          prop.Path +
                          `${
                            prop.params !== undefined && prop.params !== null
                              ? "/:param"
                              : ""
                          }`
                        }
                        render={() => (
                          <ErrorBoundary>
                            <DynamicLoader component={prop.Component} />
                          </ErrorBoundary>
                        )}
                        key={key}
                      />
                    );
                  }
                  return null;
                });
                return childRoutes;
              } else return null;
            })}
            <Route component={() => <RouteNotFound classes={classes} />} />
          </Switch>
        ) : (
          //TODO: if possible use the loader! if not move this to the centre of the screen
          <div>Loading</div>
        )}
      </main>
    </div>
  );
};

export default App;

function RouteNotFound(props: any) {
  return (
    <Paper className={props.classes.paper}>
      <Grid container wrap="nowrap">
        <Grid item>
          <Avatar className={props.classes.avatar}>!</Avatar>
        </Grid>
        <Grid item xs>
          <Typography>
            Are you lost?! If you think this route should work then try to
            login.
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

/*function DynamicLoader(props: any) {
  console.log("requesting" + props.component);
  const LazyComponent = React.lazy(() => import(`${props.component}`));
  const LazyComponentMemo = React.useMemo(() => LazyComponent, []);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponentMemo />
    </Suspense>
  );
}*/

const DynamicLoader = React.memo(function(props: any) {
  const LazyComponent = React.lazy(() => import(`${props.component}`));
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
});
