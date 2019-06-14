import React from "react";
import clsx from "clsx";
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme
} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { useAuth } from "../Contexts/AuthContext";
import {
  ListItem,
  ListItemIcon,
  Icon,
  ListItemText,
  Collapse,
  List,
  Link
} from "@material-ui/core";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    menuButton: {
      marginRight: 36
    },
    hide: {
      display: "none"
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap"
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1
      }
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3)
    },
    nested: {
      paddingLeft: theme.spacing(4)
    }
  })
);

function Sidebar(props: any) {
  const classes = useStyles();
  const theme = useTheme();
  const { sidebarOpen, setSidebarOpen } = props;

  function handleDrawerClose() {
    setSidebarOpen(false);
  }

  const Auth: any = useAuth();

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: sidebarOpen,
        [classes.drawerClose]: !sidebarOpen
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: sidebarOpen,
          [classes.drawerClose]: !sidebarOpen
        })
      }}
      open={sidebarOpen}
    >
      <div className={classes.toolbar}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </div>
      <Divider />
      {Auth.AccessibleApps &&
        Auth.AccessibleApps.map((app: any) => {
          if (
            app.ShowInNavigationTree !== undefined &&
            (app.ShowInNavigationTree === 1 ||
              app.ShowInNavigationTree === true)
          ) {
            if (app.childApps) {
              //it's a group
              return (
                <React.Fragment key={"G" + app.Application}>
                  <ListItem
                    button
                    //onClick={() => this.handleClick("G" + app.Application)}
                  >
                    <ListItemIcon>
                      <Icon color="primary">{app.Icon}</Icon>
                    </ListItemIcon>
                    <ListItemText inset primary={app.Application} />
                    {/* {this.state.open["G" + app.Application] === undefined ? (
                      <ExpandMore />
                    ) : this.state.open["G" + app.Application] ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )} */}
                  </ListItem>
                  <Collapse
                    in={
                      //this.state.open["G" + app.Application] === undefined
                      //? false
                      //: this.state.open["G" + app.Application]
                      false
                    }
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {app.childApps.map((app: any) => {
                        return (
                          // <Link
                          //   to={
                          //     app.Path +
                          //     `${
                          //       app.params !== undefined && app.params !== null
                          //         ? "/" + app.params
                          //         : ""
                          //     }`
                          //   }
                          //   key={
                          //     app.Path +
                          //     `${
                          //       app.params !== undefined && app.params !== null
                          //         ? "/" + app.params
                          //         : ""
                          //     }`
                          //   }
                          //   style={{ textDecoration: "none" }}
                          // >
                          <ListItem
                            button
                            className={classes.nested}
                            // classes={
                            //   this.props.OpenAppID === app.ApplicationID
                            //     ? { root: classes.openedMenu }
                            //     : null
                            // }
                          >
                            <ListItemIcon>
                              <Icon color="primary">{app.Icon}</Icon>
                            </ListItemIcon>
                            <ListItemText
                              // classes={
                              //   this.props.OpenAppID === app.ApplicationID
                              //     ? { primary: classes.openedApp }
                              //     : null
                              // }
                              primary={app.Application}
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            } else {
              return (
                // <Link
                //   to={
                //     app.Path +
                //     `${
                //       app.params !== undefined && app.params !== null
                //         ? "/" + app.params
                //         : ""
                //     }`
                //   }
                //   key={
                //     app.Path +
                //     `${
                //       app.params !== undefined && app.params !== null
                //         ? "/" + app.params
                //         : ""
                //     }`
                //   }
                //   style={{ textDecoration: "none" }}
                // >
                <ListItem
                  button
                  // classes={
                  //   this.props.OpenAppID === app.ApplicationID
                  //     ? { root: classes.openedMenu }
                  //     : null
                  // }
                >
                  <ListItemIcon>
                    <Icon color="primary">{app.Icon}</Icon>
                  </ListItemIcon>
                  <ListItemText
                    // classes={
                    //   this.props.OpenAppID === app.ApplicationID
                    //     ? { primary: classes.openedApp }
                    //     : null
                    // }
                    primary={app.Application}
                  />
                </ListItem>
              );
            }
          } else return null;
        })}
    </Drawer>
  );
}

export default Sidebar;
