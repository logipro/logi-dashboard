import React, { useState } from "react";
import MaterialTable from "material-table";
import { useAuth } from "../Contexts/AuthContext";
import {
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  useTheme
} from "@material-ui/core/";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useAsyncFn } from "react-use";

interface IUsersProps {}

const Users: React.FunctionComponent<IUsersProps> = props => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [passwordDialogOpen, setpasswordDialogOpen] = React.useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [selectedUserID, setSelectedUserID] = useState();
  //----
  const Auth: any = useAuth();
  const [userFetchState, fetchUsers] = useAsyncFn(async () => {
    let users = await Auth.AuthenticatedServerCall(
      `${process.env.REACT_APP_APIURL}security/users`,
      "GET"
    );
    return users;
  });

  //the fetchUsers is added to list of dependency to avoid react-hooks/exhaustive-deps warning
  React.useEffect(() => {
    const getData = async () => {
      await fetchUsers();
    };
    getData();
  }, [fetchUsers]);

  return (
    <>
      <MaterialTable
        title="Users"
        isLoading={userFetchState.loading}
        options={{
          search: true
        }}
        columns={[
          {
            title: "UserID",
            field: "UserName",
            hidden: true
          },
          {
            title: "Username",
            field: "UserName"
          },
          {
            title: "Email",
            field: "EMail"
          },
          {
            title: "Creation Date",
            field: "CREATEDAT",
            editable: "never"
          },
          {
            title: "Active ?",
            field: "IsDisabled",
            render: (rowData: any) => {
              return (
                <Checkbox checked={rowData.IsDisabled === 1 ? false : true} />
              );
            },
            editComponent: (props: any) => {
              return (
                <Checkbox
                  checked={props.value === 1 ? false : true}
                  onChange={e => {
                    props.onChange(e.target.checked ? 0 : 1);
                  }}
                />
              );
            }
          }
        ]}
        data={userFetchState.value}
        actions={[
          {
            icon: "fingerprint",
            tooltip: "Reset Password",
            onClick: (event, rowData) => {
              setSelectedUserID(rowData.UserID);
              setpasswordDialogOpen(true);
            }
          },
          {
            icon: "group_work",
            tooltip: "Add/Remove Roles",
            onClick: (event, rowData) => {
              setSelectedUserID(rowData.UserID);
              setpasswordDialogOpen(true);
            }
          }
        ]}
        editable={{
          onRowUpdate: (newData: any, oldData: any) => {
            //go through the new Data and create the update statement
            let updateStatement: String = "";
            for (let key in newData) {
              if (newData[key] !== oldData[key]) {
                updateStatement += `${key} = "${newData[key]}" ,`;
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
                  UserID: oldData.UserID,
                  Update: updateStatement
                }
              )
                .then(() => fetchUsers())
                .catch((error: any) => {
                  console.log(error);
                  return Promise.resolve("something went wrong");
                });
            }
            return Promise.resolve("nothing to change");
          },
          onRowAdd: (newData: any) => {
            if (!newData.UserName || !newData.EMail) {
              return Promise.reject("Please fill all required fields");
            }
            return Auth.AuthenticatedServerCall(
              `${process.env.REACT_APP_APIURL}security/users`,
              "POST",
              {
                Insert: `(Username,Email,createdBy,CreatedAt,IsDisabled)  SELECT '${newData.UserName.trim()}' ,  '${newData.EMail.trim()}'
                  , ${Auth.LoggedInUserID}, datetime("now"),${
                  newData.IsDisabled ? newData.IsDisabled : 0
                } `
              }
            )
              .then(() => fetchUsers())
              .catch((error: any) => {
                console.log(error);
                return undefined;
              });
          }
        }}
      />
      <Dialog
        fullScreen={fullScreen}
        open={passwordDialogOpen}
        onClose={() => setpasswordDialogOpen(false)}
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
              setpasswordDialogOpen(false);
              setNewPassword("");
              setRepeatPassword("");
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
                .then(() => {
                  setNewPassword("");
                  setRepeatPassword("");
                  setSelectedUserID(undefined);
                })
                .catch((error: any) => {
                  console.log(error);
                  return undefined;
                });
              setpasswordDialogOpen(false);
            }}
            color="primary"
            autoFocus
            disabled={newPassword.length <= 0 || newPassword !== repeatPassword}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Users;
