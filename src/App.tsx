import React, { Suspense } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Header from "./framework/layout/Header";
import Sidebar from "./framework/layout/Sidebar";
import { Route, Switch, withRouter } from "react-router-dom";
import { useAuth } from "./framework/Contexts/AuthContext";
import {
  Avatar,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CardHeader
} from "@material-ui/core";
import ErrorBoundary from "./framework/helpers/ErrorBoundary";
import { deepOrange } from "@material-ui/core/colors";

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
                        app.params !== undefined &&
                        app.params !== null &&
                        app.params.trim().length > 0
                          ? "/:param"
                          : ""
                      }`
                    }
                    render={() => (
                      <ErrorBoundary>
                        <DynamicLoader
                          component={app.Component}
                          loadedProps={
                            app.AppProps ? JSON.parse(app.AppProps) : null
                          }
                        />
                      </ErrorBoundary>
                    )}
                    key={key}
                  />
                );
              } else if (app.childApps) {
                var childRoutes = app.childApps.map(
                  (childApp: any, key: any) => {
                    if (
                      childApp.Path &&
                      childApp.Path !== "" &&
                      childApp.Component &&
                      childApp.Component !== ""
                    ) {
                      return (
                        <Route
                          exact
                          path={
                            childApp.Path +
                            `${
                              childApp.params !== undefined &&
                              childApp.params !== null &&
                              childApp.params.trim().length > 0
                                ? "/:param"
                                : ""
                            }`
                          }
                          render={() => (
                            <ErrorBoundary>
                              <DynamicLoader
                                component={childApp.Component}
                                loadedProps={
                                  childApp.AppProps
                                    ? JSON.parse(childApp.AppProps)
                                    : null
                                }
                              />
                            </ErrorBoundary>
                          )}
                          key={key}
                        />
                      );
                    }
                    return null;
                  }
                );
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

const RouteNotFound = withRouter((props: any) => {
  const Auth: any = useAuth();
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar
            style={{ backgroundColor: deepOrange[500] }}
            aria-label="Error"
          >
            !
          </Avatar>
        }
        title="Error Accessing this route"
      />
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          No access to this route
        </Typography>
        <Typography variant="body2" component="p">
          Try to login if you believe you should have access to this app or go
          back to dashboard
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => {
            Auth.showLogin();
          }}
          variant={"outlined"}
          color={"primary"}
        >
          Login
        </Button>
        <Button
          size="small"
          onClick={() => {
            props.history.push("/");
          }}
          variant={"outlined"}
          color={"secondary"}
        >
          Back to dashboard
        </Button>
      </CardActions>
    </Card>
  );
});

//this map will keep all the already loaded components
//TODO: empty this after user logs out or maybe move to Auth
const componentsMap = new Map();

const getCachedLazy = (component: any) => {
  if (componentsMap.has(component)) return componentsMap.get(component);

  const Component = React.lazy(() => import(`${component}`));

  componentsMap.set(component, Component);

  return Component;
};

const DynamicLoader = (props: any) => {
  const LazyComponent = getCachedLazy(props.component);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent loadedProps={props.loadedProps} />
    </Suspense>
  );
};
