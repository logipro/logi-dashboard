import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../Contexts/AuthContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  useTheme,
  IconButton,
  Paper,
  Avatar,
  Chip
} from "@material-ui/core/";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {
  TableColumn,
  LogiTable,
  rowActionsAndStates
} from "../Components/logi-table"; //"logi-table";
import Fingerprint from "@material-ui/icons/Fingerprint";
import GroupWork from "@material-ui/icons/GroupWork";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import RemoveCircle from "@material-ui/icons/RemoveCircle";
import AddCircle from "@material-ui/icons/AddCircle";
import CircularProgress from "@material-ui/core/CircularProgress";
import { EditComp } from "../Components/logi-table/StandardActions";

interface IUsersProps {}

const Users: React.FunctionComponent<IUsersProps> = props => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const Auth: any = useAuth();
  const [passwordDialogOpen, setPasswordDialogOpen] = React.useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [selectedUserID, setSelectedUserID] = useState();
  const [rolesDialogOpen, setRolesDialogOpen] = useState(false);
  const [refreshData, setRefreshData] = useState<number>(0);
  //----
  async function fetchUsers() {
    let users = await Auth.AuthenticatedServerCall(
      `${process.env.REACT_APP_APIURL}security/users`,
      "GET"
    );
    return users;
  }
  //----Have to memoize this value because otherwise on every render
  //---the component thinks the value has changed
  const memorizedFetchUser = useCallback(fetchUsers, []);
  //----

  const columnsU: TableColumn[] = [
    {
      header: "Actions",
      accessor: "ActionColumnOne",
      dataType: "ActionColumn",
      viewComponent: (row: any, rowActionsAndStates: rowActionsAndStates) => {
        return (
          <EditComp
            {...rowActionsAndStates}
            saveChanges={(): Promise<boolean> => {
              //go through the new Data and create the update statement
              let updateStatement: String = "";
              for (let key in rowActionsAndStates.newData) {
                if (
                  rowActionsAndStates.newData[key] !==
                  rowActionsAndStates.oldData[key]
                ) {
                  updateStatement += `${key} = "${
                    rowActionsAndStates.newData[key]
                  }" ,`;
                }
              }
              if (updateStatement.length > 0) {
                //remove the last comma
                updateStatement = updateStatement.substring(
                  0,
                  updateStatement.length - 1
                );
                return Auth.AuthenticatedServerCall(
                  `${process.env.REACT_APP_APIURL}security/users`,
                  "PUT",
                  {
                    UserID: rowActionsAndStates.oldData.UserID,
                    Update: updateStatement
                  }
                )
                  .then((r: any) => {
                    console.log(r);
                    //rowActionsAndStates.discardEditMode();
                    //rowActionsAndStates.setData(rowActionsAndStates.newData);
                    setRefreshData(refreshData + 1);
                  })
                  .catch((error: any) => {
                    console.log(error);
                    rowActionsAndStates.discardEditMode();
                  });
              }
              return Promise.resolve(true);
            }}
          />
        );
      }
    },
    {
      header: "UserID",
      accessor: "UserID",
      dataType: "Number",
      hidden: false,
      readOnly: true
    },
    {
      header: "Username",
      accessor: "UserName",
      dataType: "String"
    },
    {
      header: "Email",
      accessor: "EMail",
      dataType: "String"
    },
    {
      header: "Creation Date",
      accessor: "CREATEDAT",
      dataType: "DateTime"
    },
    {
      header: "Is Disabled",
      accessor: "IsDisabled",
      dataType: "Boolean"
    },
    {
      header: "Actions",
      accessor: "ActionColumnTwo",
      dataType: "ActionColumn",
      viewComponent: row => {
        return (
          <>
            <IconButton
              onClick={(event: any) => {
                setSelectedUserID(row.UserID);
                setPasswordDialogOpen(true);
              }}
              title="reset password"
            >
              <Fingerprint />
            </IconButton>
            <IconButton
              onClick={(event: any) => {
                setSelectedUserID(row.UserID);
                setRolesDialogOpen(true);
              }}
              title="reset password"
            >
              <GroupWork />
            </IconButton>
          </>
        );
      }
    }
  ];

  return (
    <>
      <LogiTable
        refreshData={refreshData}
        dense={true}
        allowSort={true}
        columns={columnsU}
        keyAccessor="UserID"
        data={memorizedFetchUser}
        allowSelection={false}
        // addNewRecord={(newData: any) => {
        //   if (!newData.UserName || !newData.EMail) {
        //     return Promise.reject("Please fill all required fields");
        //   }
        //   return Auth.AuthenticatedServerCall(
        //     `${process.env.REACT_APP_APIURL}security/users`,
        //     "POST",
        //     {
        //       Insert: `(Username,Email,createdBy,CreatedAt,IsDisabled)  SELECT '${newData.UserName.trim()}' ,  '${newData.EMail.trim()}'
        //         , ${Auth.LoggedInUserID}, datetime("now"),${
        //         newData.IsDisabled ? newData.IsDisabled : 0
        //       } `
        //     }
        //   )
        //     .then((r: any) => {
        //       return true;
        //     })
        //     .catch((error: any) => {
        //       console.log(error);
        //       return false;
        //     });
        // }}
        // editRecord={(oldData: any, newData: any): Promise<boolean> => {
        //   //go through the new Data and create the update statement
        //   let updateStatement: String = "";
        //   for (let key in newData) {
        //     if (newData[key] !== oldData[key]) {
        //       updateStatement += `${key} = "${newData[key]}" ,`;
        //     }
        //   }
        //   if (updateStatement.length > 0) {
        //     //remove the last comma
        //     updateStatement = updateStatement.substring(
        //       0,
        //       updateStatement.length - 1
        //     );
        //     return Auth.AuthenticatedServerCall(
        //       `${process.env.REACT_APP_APIURL}security/users`,
        //       "PUT",
        //       {
        //         UserID: oldData.UserID,
        //         Update: updateStatement
        //       }
        //     )
        //       .then((r: any) => {
        //         return true;
        //       })
        //       .catch((error: any) => {
        //         console.log(error);
        //         return false;
        //       });
        //   }
        //   return Promise.resolve(true);
        // }}
      />
      <Dialog
        fullScreen={fullScreen}
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Change Password"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="NewPassword"
            label="New Password"
            type="password"
            fullWidth
            required
            value={newPassword}
            onChange={event => setNewPassword(event.target.value)}
          />
          <TextField
            margin="dense"
            id="repeatPassword"
            label="Repeat Password"
            type="password"
            fullWidth
            required
            value={repeatPassword}
            onChange={event => setRepeatPassword(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setPasswordDialogOpen(false);
              setNewPassword("");
              setRepeatPassword("");
              setSelectedUserID(undefined);
            }}
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              return Auth.AuthenticatedServerCall(
                `${process.env.REACT_APP_APIURL}security/userpassword`,
                "PUT",
                {
                  UserID: `${selectedUserID}`,
                  password: newPassword
                }
              )
                .then((r: any) => {
                  setNewPassword("");
                  setRepeatPassword("");
                  setSelectedUserID(undefined);
                  setPasswordDialogOpen(false);
                })
                .catch((error: any) => {
                  console.log(error);
                  return undefined;
                });
            }}
            color="primary"
            autoFocus
            disabled={newPassword.length <= 0 || newPassword !== repeatPassword}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {rolesDialogOpen ? (
        <UserRoleDialog
          fullScreen={fullScreen}
          setRolesDialogOpen={setRolesDialogOpen}
          selectedUserID={selectedUserID}
          setSelectedUserID={setSelectedUserID}
          Auth={Auth}
        />
      ) : null}
    </>
  );
};

export default Users;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      padding: theme.spacing(2),
      minWidth: 300,
      minHeight: 300
    },
    chip: {
      margin: theme.spacing(2)
    }
  })
);

const UserRoleDialog = function(props: {
  fullScreen: boolean;
  setRolesDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUserID: any;
  setSelectedUserID: React.Dispatch<any>;
  Auth: any;
}) {
  const classes = useStyles();
  const [userRoles, setUserRoles] = useState();
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [loadingRolesError, setLoadingRolesError] = useState(false);
  const getUsersRoles = function() {
    var url = `${process.env.REACT_APP_APIURL}security/roles/${
      props.selectedUserID
    }`;
    setIsLoadingRoles(true);
    props.Auth.AuthenticatedServerCall(url, "GET")
      .then((userRoles: any) => {
        setUserRoles(userRoles);
        setIsLoadingRoles(false);
      })
      .catch((error: any) => {
        setUserRoles(undefined);
        setIsLoadingRoles(false);
        setLoadingRolesError(true);
      });
  };

  useEffect(() => {
    if (props.selectedUserID >= 0) {
      getUsersRoles();
    }
  }, [props.selectedUserID]);

  function modifyUsersRole(userID: number, roleID: number, isAdd: boolean) {
    setIsLoadingRoles(true);
    var url = `${process.env.REACT_APP_APIURL}security/modifyUserRoles`;
    props.Auth.AuthenticatedServerCall(
      url,
      "POST",
      {
        userID: `${userID}`,
        roleID: `${roleID}`,
        isAdd: `${isAdd}`
      },
      "Role Updated Successfully"
    )
      .then((response: any) => {})
      .catch((error: any) => {
        setLoadingRolesError(true);
      })
      .then(() => {
        setIsLoadingRoles(false);
        getUsersRoles();
      });
  }

  return (
    <Dialog
      fullScreen={props.fullScreen}
      open={true}
      onClose={() => props.setRolesDialogOpen(false)}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {"Change User's Roles"}
      </DialogTitle>
      <DialogContent>
        <Paper className={classes.root}>
          {isLoadingRoles ? (
            <CircularProgress size={30} />
          ) : userRoles !== undefined ? (
            userRoles.map((data: any) => {
              return (
                <Chip
                  key={data.RoleID}
                  label={data.Role}
                  className={classes.chip}
                  color={data.IsUsersRole ? "primary" : "secondary"}
                  avatar={
                    <Avatar>{(data.Role + "xx").substring(0, 2)} </Avatar>
                  }
                  variant="outlined"
                  onDelete={() => {
                    modifyUsersRole(
                      props.selectedUserID,
                      data.RoleID,
                      !data.IsUsersRole
                    );
                  }}
                  deleteIcon={
                    data.IsUsersRole ? <RemoveCircle /> : <AddCircle />
                  }
                />
              );
            })
          ) : null}
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            props.setRolesDialogOpen(false);
            props.setSelectedUserID(undefined);
            setUserRoles(undefined);
          }}
          color="secondary"
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};
