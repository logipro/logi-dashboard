import React, { useState } from "react";
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
  List
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

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

  const [openGroups, setOpenGroups] = useState<Array<string>>([]);
  function handleGroupClick(groupName: string) {
    let index = openGroups.indexOf(groupName);
    if (index >= 0) {
      // means it's already open so we remove it
      openGroups.splice(index, 1);
      setOpenGroups([...openGroups]);
    } else {
      setOpenGroups([...openGroups, groupName]);
    }
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
      <List component="div" disablePadding>
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
                      onClick={() => handleGroupClick("G" + app.Application)}
                    >
                      <ListItemIcon>
                        <Icon color="primary">{app.Icon}</Icon>
                      </ListItemIcon>
                      <ListItemText primary={app.Application} />
                      {openGroups.includes("G" + app.Application) ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </ListItem>
                    <Collapse
                      in={openGroups.includes("G" + app.Application)}
                      timeout="auto"
                      unmountOnExit
                    >
                      {app.childApps.map((app: any) => {
                        return (
                          <ListItemLink
                            to={
                              app.Path +
                              `${
                                app.params !== undefined && app.params !== null
                                  ? "/" + app.params
                                  : ""
                              }`
                            }
                            primary={app.Application}
                            icon={app.Icon}
                            key={
                              app.Path +
                              `${
                                app.params !== undefined && app.params !== null
                                  ? "/" + app.params
                                  : ""
                              }`
                            }
                            className={classes.nested}
                          />
                        );
                      })}
                    </Collapse>
                  </React.Fragment>
                );
              } else {
                return (
                  <ListItemLink
                    to={
                      app.Path +
                      `${
                        app.params !== undefined && app.params !== null
                          ? "/" + app.params
                          : ""
                      }`
                    }
                    primary={app.Application}
                    icon={app.Icon}
                    key={
                      app.Path +
                      `${
                        app.params !== undefined && app.params !== null
                          ? "/" + app.params
                          : ""
                      }`
                    }
                  />
                );
              }
            } else return null;
          })}
      </List>
    </Drawer>
  );
}

export default Sidebar;

class ListItemLink extends React.Component<any, any> {
  renderLink = React.forwardRef((itemProps: any, ref: any) => (
    <RouterLink to={this.props.to} {...itemProps} ref={ref} />
  ));

  render() {
    const { icon, primary } = this.props;
    return (
      <li>
        <ListItem button component={this.renderLink} {...this.props}>
          <ListItemIcon>
            <Icon color="primary">{icon}</Icon>
          </ListItemIcon>
          <ListItemText primary={primary} />
        </ListItem>
      </li>
    );
  }
}
