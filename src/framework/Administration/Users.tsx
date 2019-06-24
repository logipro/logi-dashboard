import * as React from "react";
import MaterialTable from "material-table";
import { useAuth } from "../Contexts/AuthContext";
import { Checkbox } from "@material-ui/core/";
import { useAsyncFn } from "react-use";

interface IUsersProps {}

const Users: React.FunctionComponent<IUsersProps> = props => {
  const Auth: any = useAuth();
  const [userFetchState, fetchUsers] = useAsyncFn(async () => {
    let users = await Auth.AuthenticatedServerCall(
      `${process.env.REACT_APP_APIURL}security/users`,
      "GET"
    );
    return users;
  });

  React.useEffect(() => {
    const getData = async () => {
      await fetchUsers();
    };
    getData();
  }, []);

  return (
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
      editable={{
        isEditable: (rowData: any) => true,
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
                return undefined;
              });
          }
        }
      }}
    />
  );
};

export default Users;
