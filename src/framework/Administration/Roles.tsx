import React, { useState, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import {
  LogiTable,
  TableColumn,
  rowActionsAndStates,
  toolbarActionsAndState,
  LogiStandardToolbar
} from "../Components/logi-table"; //"logi-table";
import { StandardActions } from "../Components/logi-table/StandardActions";
import { Checkbox } from "@material-ui/core";

interface IRolesProps {}

const Roles: React.FunctionComponent<IRolesProps> = function(props) {
  console.log("in");
  const [state, setstate] = useState(0);
  useEffect(() => {
    setstate(state + 1);
  }, []);
  return <div>{state}</div>;
};

const Roles1: React.FunctionComponent<IRolesProps> = function(props) {
  const [roles, setRoles] = useState();
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedRoleID, setSelectedRoleID] = useState();
  const Auth: any = useAuth();
  useEffect(() => {
    async function fetchRoles() {
      setIsLoadingRoles(true);
      //sending -1 as userID in order to get all Roles
      var url = `${process.env.REACT_APP_APIURL}security/roles/-1`;
      let roles = await Auth.AuthenticatedServerCall(url, "GET");
      setRoles(roles);
      setIsLoadingRoles(false);
    }
    fetchRoles();
  }, [Auth]);

  async function insertRole(newData: any) {
    try {
      if (!newData.Role || !newData.Description) {
        return Promise.reject("Please fill all required fields");
      }
      var url = `${process.env.REACT_APP_APIURL}security/roles`;

      await Auth.AuthenticatedServerCall(url, "POST", {
        Insert: ` (Role,Description,createdBy,CreatedAt)  SELECT '${newData.Role.trim()}' ,
        '${newData.Description.trim()}'
      , ${Auth.LoggedInUserID}, datetime("now")`
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async function deleteRole(RoleID: any) {
    var url = `${process.env.REACT_APP_APIURL}security/roles`;
    await Auth.AuthenticatedServerCall(url, "DELETE", { RoleID: RoleID });
    setRefreshTrigger(refreshTrigger ? refreshTrigger : 0 + 1);
  }

  const columns: TableColumn[] = [
    {
      header: "Actions",
      accessor: "ActionColumnOne",
      dataType: "ActionColumn",
      viewComponent: (row: any, rowAsAndSs: rowActionsAndStates) => {
        return (
          <>
            <Checkbox
              checked={selectedRoleID === row.RoleID}
              onClick={() => {
                setSelectedRoleID(row.RoleID);
              }}
            />
            <StandardActions
              {...rowAsAndSs}
              deleteRecord={(): void => {
                if (
                  window.confirm(
                    `Are you sure you want to delete ${row.Role} ?`
                  )
                )
                  deleteRole(row.RoleID);
              }}
            />
          </>
        );
      }
    },
    {
      header: "RoleID",
      accessor: "RoleID",
      dataType: "Number",
      hidden: false,
      readOnly: true
    },
    {
      header: "Role",
      accessor: "Role",
      dataType: "String"
    },
    {
      header: "Description",
      accessor: "Description",
      dataType: "String"
    },
    {
      header: "CreatedAt",
      accessor: "CreatedAt",
      dataType: "DateTime"
    }
  ];
  return (
    <>
      <LogiTable
        dense={true}
        allowSort={true}
        columns={columns}
        keyAccessor="RoleID"
        data={roles}
        //allowSelection={true}
        tableToolbar={(actionsAndStates: toolbarActionsAndState) => {
          return (
            <LogiStandardToolbar
              actionsAndStates={actionsAndStates}
              title={"Roles"}
              insertNewRecord={async recordData => {
                try {
                  const newData: any = actionsAndStates.insertedRecordData();
                  await insertRole(newData);
                  setRefreshTrigger(refreshTrigger ? refreshTrigger : 0 + 1);
                  actionsAndStates.discardInsertMode();
                } catch (exception) {
                  console.log(exception);
                  alert("something went wrong, trying to save the data");
                }
              }}
            />
          );
        }}
      />
    </>
  );
};

export default Roles;
