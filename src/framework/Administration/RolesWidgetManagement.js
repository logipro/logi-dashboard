import {
  Avatar,
  Card,
  CardHeader,
  Checkbox,
  CircularProgress,
  Icon,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import withStyles from "@material-ui/core/styles/withStyles";
import Widgets from "@material-ui/icons/Widgets";
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
    rolesWidgets: [],
    loadingWidgets: false
  };

  fetchRolesWidgets(RoleID) {
    var url = `${process.env.REACT_APP_APIURL}security/rolesWidgets/${RoleID}`;
    this.setState({ loadingWidgets: true });
    this.props.Auth.AuthenticatedServerCall(url, "GET")
      .then(rolesWidgets => {
        let tempApps = rolesWidgets.filter(
          app => app.ParentID && app.ParentID === -1
        );
        tempApps.forEach(appGroup => {
          let appsForGroup = rolesWidgets.filter(app => {
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
          ...rolesWidgets.filter(app => !app.ParentID || app.ParentID === null)
        );
        this.setState({
          rolesWidgets: tempApps.sort(
            (appA, appB) => appA.AppOrder - appB.AppOrder
          ),
          loadingWidgets: false
        });
      })
      .catch(error => this.setState({ error, loadingWidgets: false }));
  }

  modifyRoleWidgets(RoleID, WidgetID, WidgetRoleID) {
    this.setState({ loadingWidgets: true });
    var url = `${process.env.REACT_APP_APIURL}security/modifyRoleWidgets`;
    this.props.Auth.AuthenticatedServerCall(url, "POST", {
      RoleID: RoleID,
      WidgetID: WidgetID,
      WidgetRoleID: WidgetRoleID
    })
      .then(() => this.fetchRolesWidgets(this.props.selectedRoleID))
      .catch(error => {
        this.setState({
          loadingWidgets: false
        });
        this.fetchRolesWidgets(this.props.selectedRoleID);
      });
  }

  componentDidUpdate(prevProp) {
    if (prevProp.selectedRoleID !== this.props.selectedRoleID) {
      if (this.props.selectedRoleID < 0) {
        this.setState({
          rolesWidgets: []
        });
        return;
      }
      if (this.props.selectedRoleID && this.props.selectedRoleID >= 0)
        this.fetchRolesWidgets(this.props.selectedRoleID);
    }
  }

  componentDidMount() {
    if (this.props.selectedRoleID >= 0) {
      this.fetchRolesWidgets(this.props.selectedRoleID);
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
              title="Please Select a Role to view/amend accessible Widgets"
            />
          ) : !props.loadingWidgets ? (
            <React.Fragment>
              <CardHeader
                avatar={
                  <Avatar aria-label="Widgets" className={props.classes.avatar}>
                    <Widgets />
                  </Avatar>
                }
                title="You can tune accessible widgets for the roles"
                subheader="Please note Public widgets are accessible for everyone"
              />
              <List>
                <div>
                  {this.state.rolesWidgets.map(app => {
                    return (
                      <ListItem
                        button
                        className={props.classes.nested}
                        key={app.WidgetID}
                      >
                        <Checkbox
                          checked={Boolean(app.IsPublic || app.WidgetRoleID)}
                          disabled={Boolean(app.IsPublic)}
                          onChange={() => {
                            this.modifyRoleWidgets(
                              props.selectedRoleID,
                              app.WidgetID,
                              app.WidgetRoleID
                            );
                          }}
                        />
                        <ListItemIcon>
                          <Icon color="primary">{app.Icon}</Icon>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            app.Name + (app.IsPublic ? " (PUBLIC) " : "")
                          }
                        />
                      </ListItem>
                    );
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
