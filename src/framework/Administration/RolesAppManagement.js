import {
  Avatar,
  Card,
  CardHeader,
  Checkbox,
  CircularProgress,
  Collapse,
  Icon,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import withStyles from "@material-ui/core/styles/withStyles";
import Apps from "@material-ui/icons/Apps";
import React, { Component } from "react";

const styles = theme => ({
  nested: {
    paddingLeft: theme.spacing(4)
  },
  progress: {
    margin: theme.spacing(2)
  },
  avatar: {
    backgroundColor: red[500]
  }
});

class AppsManagement extends Component {
  state = {
    rolesApps: [],
    loadingApps: false
  };

  fetchRolesApps(RoleID) {
    var url = `${process.env.REACT_APP_APIURL}security/rolesApps/${RoleID}`;
    this.setState({ loadingApps: true });
    this.props.Auth.AuthenticatedServerCall(url, "GET")
      .then(rolesApps => {
        let tempApps = rolesApps.filter(
          app => app.ParentID && app.ParentID === -1
        );
        tempApps.forEach(appGroup => {
          let appsForGroup = rolesApps.filter(app => {
            return app.ParentID === appGroup.ApplicationID;
          });
          if (appsForGroup.length > 0) {
            appGroup.ShowInNavigationTree = true;
            appGroup.childApps = appsForGroup;
          } else {
            appGroup.ShowInNavigationTree = false; //empty group no need to display
          }
        });
        //---add all other apps (with no parent)
        tempApps.push(
          ...rolesApps.filter(app => !app.ParentID || app.ParentID === null)
        );
        this.setState({
          rolesApps: tempApps.sort(
            (appA, appB) => appA.AppOrder - appB.AppOrder
          ),
          loadingApps: false
        });
      })
      .catch(error => this.setState({ error, loadingApps: false }));
  }

  modifyRoleApps(RoleID, ApplicationID, ApplicationRoleID) {
    this.setState({ loadingApps: true });
    var url = `${process.env.REACT_APP_APIURL}security/modifyRoleApps`;
    this.props.Auth.AuthenticatedServerCall(url, "POST", {
      RoleID: RoleID,
      ApplicationID: ApplicationID,
      ApplicationRoleID: ApplicationRoleID
    })
      .then(() => {
        this.fetchRolesApps(this.props.selectedRoleID);
        this.setState({
          loadingApps: false
        });
      })
      .catch(error => {
        this.setState({
          loadingApps: false
        });
        this.fetchRolesApps(this.props.selectedRoleID);
      });
  }

  componentDidUpdate(prevProp) {
    if (prevProp.selectedRoleID !== this.props.selectedRoleID) {
      if (this.props.selectedRoleID < 0) {
        this.setState({
          rolesApps: []
        });
        return;
      }
      if (this.props.selectedRoleID && this.props.selectedRoleID >= 0)
        this.fetchRolesApps(this.props.selectedRoleID);
    }
  }
  componentDidMount() {
    if (this.props.selectedRoleID && this.props.selectedRoleID >= 0) {
      this.fetchRolesApps(this.props.selectedRoleID);
    }
  }

  render() {
    const props = this.props;
    return (
      <React.Fragment>
        <Card style={{ height: "100%", overflow: "Auto" }}>
          {!props.selectedRoleID ? (
            <CardHeader
              avatar={
                <Avatar aria-label="Apps" className={props.classes.avatar}>
                  R
                </Avatar>
              }
              title="Please Select a Role to view/amend accessible Apps"
            />
          ) : !props.loadingApps ? (
            <React.Fragment>
              <CardHeader
                avatar={
                  <Avatar aria-label="Apps" className={props.classes.avatar}>
                    <Apps />
                  </Avatar>
                }
                title="You can tune accessible app for the roles"
                subheader="Please note Public apps are accessible for everyone"
              />
              <List>
                <div>
                  {this.state.rolesApps.map(app => {
                    if (
                      app.ShowInNavigationTree !== undefined &&
                      (app.ShowInNavigationTree === 1 ||
                        app.ShowInNavigationTree === true)
                    ) {
                      if (app.childApps) {
                        //it's a group
                        return (
                          <React.Fragment key={"G" + app.Application}>
                            <ListItem button key={app.ApplicationID}>
                              <ListItemIcon>
                                <Icon color="primary">{app.Icon}</Icon>
                              </ListItemIcon>
                              <ListItemText inset primary={app.Application} />
                            </ListItem>
                            <Collapse in={true} timeout="auto" unmountOnExit>
                              <List component="div" disablePadding>
                                {app.childApps.map(app => {
                                  return (
                                    <ListItem
                                      button
                                      className={props.classes.nested}
                                      key={app.ApplicationID}
                                    >
                                      <Checkbox
                                        checked={Boolean(
                                          app.IsPublic || app.ApplicationRoleID
                                        )}
                                        disabled={Boolean(app.IsPublic)}
                                        onChange={() => {
                                          this.modifyRoleApps(
                                            props.selectedRoleID,
                                            app.ApplicationID,
                                            app.ApplicationRoleID
                                          );
                                        }}
                                      />
                                      <ListItemIcon>
                                        <Icon color="primary">{app.Icon}</Icon>
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={
                                          app.Application +
                                          (app.IsPublic ? " (PUBLIC) " : "")
                                        }
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
                          <ListItem button key={app.ApplicationID}>
                            <Checkbox
                              checked={Boolean(
                                app.IsPublic || app.ApplicationRoleID
                              )}
                              disabled={Boolean(app.IsPublic)}
                              onChange={() =>
                                this.modifyRoleApps(
                                  props.selectedRoleID,
                                  app.ApplicationID,
                                  app.ApplicationRoleID
                                )
                              }
                            />
                            <ListItemIcon>
                              <Icon color="primary">{app.Icon}</Icon>
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                app.Application +
                                (app.IsPublic ? " (PUBLIC) " : "")
                              }
                            />
                          </ListItem>
                        );
                      }
                    } else return null;
                  })}
                </div>
              </List>
            </React.Fragment>
          ) : (
            <CircularProgress />
          )}
        </Card>
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(AppsManagement);
