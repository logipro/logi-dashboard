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
import { Tabs, Tab, makeStyles, Theme, createStyles } from "@material-ui/core";
import Apps from "@material-ui/icons/Apps";
import Widgets from "@material-ui/icons/Widgets";
import RolesAppManagement from "./RolesAppManagement";
import RolesWidgetManagement from "./RolesWidgetManagement";

interface IRolesProps {}

const Roles: React.FunctionComponent<IRolesProps> = function(props) {
  const [roles, setRoles] = useState();
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  //const [selectedRoleID, setSelectedRoleID] = useState();
  const Auth: any = useAuth();
  useEffect(() => {
    async function fetchRoles() {
      setIsLoadingRoles(true);
      //sending -1 as userID in order to get all Roles
      var url = `${process.env.REACT_APP_APIURL}security/roles/-1`;
      let roles = await Auth.AuthenticatedServerCall(url, "GET");
      console.log("fetch finished");
      setRoles(roles);
      setIsLoadingRoles(false);
    }
    fetchRoles();
  }, [Auth, refreshTrigger]);

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
    try {
      var url = `${process.env.REACT_APP_APIURL}security/roles`;
      await Auth.AuthenticatedServerCall(url, "DELETE", { RoleID: RoleID });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  const columns: TableColumn[] = [
    {
      header: "Actions",
      accessor: "ActionColumnOne",
      dataType: "ActionColumn",
      viewComponent: (row: any, rowAsAndSs: rowActionsAndStates) => {
        return (
          <>
            {/* <Checkbox
              checked={selectedRoleID === row.RoleID}
              onClick={() => {
                if (selectedRoleID === row.RoleID) setSelectedRoleID(undefined);
                else setSelectedRoleID(row.RoleID);
              }}
            /> */}
            <StandardActions
              {...rowAsAndSs}
              expandComp={<RolesDetail selectedRoleID={row.RoleID} />}
              deleteRecord={async () => {
                if (
                  window.confirm(
                    `Are you sure you want to delete ${row.Role} ?`
                  )
                ) {
                  setIsLoadingRoles(true);
                  await deleteRole(row.RoleID);
                  setRefreshTrigger(refreshTrigger ? refreshTrigger : 0 + 1);
                  setIsLoadingRoles(false);
                }
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
      hidden: true,
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
      dataType: "DateTime",
      readOnly: true
    }
  ];
  return (
    <>
      <LogiTable
        isRemoteLoading={isLoadingRoles}
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
                  setIsLoadingRoles(true);
                  const newData: any = actionsAndStates.insertedRecordData();
                  await insertRole(newData);
                  setRefreshTrigger(refreshTrigger ? refreshTrigger : 0 + 1);
                  actionsAndStates.discardInsertMode();
                  setIsLoadingRoles(false);
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tabsRoot: {
      borderBottom: "1px solid #e8e8e8"
    }
  })
);

function RolesDetail(props: any) {
  const Auth: any = useAuth();
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <>
      <Tabs
        value={selectedTab}
        classes={{ root: classes.tabsRoot }}
        onChange={(event, value) => {
          setSelectedTab(value);
        }}
      >
        <Tab icon={<Apps />} />
        <Tab icon={<Widgets />} />
      </Tabs>
      {selectedTab === 0 && (
        <RolesAppManagement selectedRoleID={props.selectedRoleID} Auth={Auth} />
      )}
      {selectedTab === 1 && (
        <RolesWidgetManagement
          selectedRoleID={props.selectedRoleID}
          Auth={Auth}
        />
      )}
    </>
  );
}
