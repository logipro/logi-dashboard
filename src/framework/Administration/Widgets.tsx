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

interface IWidgetsProps {}

const Widgets: React.FunctionComponent<IWidgetsProps> = function(props) {
  const [widgets, setWidgets] = useState();
  const [isLoadingWidgets, setIsLoadingWidgets] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const Auth: any = useAuth();
  useEffect(() => {
    async function fetchRoles() {
      setIsLoadingWidgets(true);
      var url = `${process.env.REACT_APP_APIURL}security/widgets`;
      let roles = await Auth.AuthenticatedServerCall(url, "GET");
      setWidgets(roles);
      setIsLoadingWidgets(false);
    }
    fetchRoles();
  }, [Auth, refreshTrigger]);

  async function insertWidget(newData: any) {
    try {
      var url = `${process.env.REACT_APP_APIURL}security/widgets`;

      await Auth.AuthenticatedServerCall(url, "POST", {
        Insert: ` ("Name", "Component", "Properties", "Description", "IsPublic")
          SELECT '${newData.Name.trim()}' ,
        '${newData.Component ? newData.Component : null}' ,
        '${newData.Properties ? newData.Properties : null}' ,
        '${newData.Description.trim()}', 
        ${newData.IsPublic ? newData.IsPublic : null}        
      `
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async function deleteWidget(WidgetID: number) {
    try {
      var url = `${process.env.REACT_APP_APIURL}security/widgets`;
      let a = await Auth.AuthenticatedServerCall(url, "DELETE", {
        WidgetID: WidgetID
      });
      console.log(a);
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
            <StandardActions
              {...rowAsAndSs}
              deleteRecord={async () => {
                if (
                  window.confirm(
                    `Are you sure you want to delete ${row.Name} ?`
                  )
                ) {
                  setIsLoadingWidgets(true);
                  await deleteWidget(row.WidgetID);
                  setRefreshTrigger(refreshTrigger ? refreshTrigger : 0 + 1);
                  setIsLoadingWidgets(false);
                }
              }}
              saveChanges={(): Promise<boolean> => {
                //go through the new Data and create the update statement
                let updateStatement: String = "";
                for (let key in rowAsAndSs.newData) {
                  if (rowAsAndSs.newData[key] !== rowAsAndSs.oldData[key]) {
                    updateStatement += `${key} = '${
                      rowAsAndSs.newData[key]
                    }' ,`;
                  }
                }
                if (updateStatement.length > 0) {
                  //remove the last comma
                  updateStatement = updateStatement.substring(
                    0,
                    updateStatement.length - 1
                  );
                  return Auth.AuthenticatedServerCall(
                    `${process.env.REACT_APP_APIURL}security/widgets`,
                    "PUT",
                    {
                      WidgetID: rowAsAndSs.oldData.WidgetID,
                      Update: updateStatement
                    }
                  )
                    .then((r: any) => {
                      console.log(r);
                      setRefreshTrigger(
                        refreshTrigger ? refreshTrigger : 0 + 1
                      );
                    })
                    .catch((error: any) => {
                      console.log(error);
                      rowAsAndSs.discardEditMode();
                      setRefreshTrigger(
                        refreshTrigger ? refreshTrigger : 0 + 1
                      );
                    });
                }
                return Promise.resolve(true);
              }}
            />
          </>
        );
      }
    },
    {
      header: "WidgetID",
      accessor: "WidgetID",
      dataType: "Number",
      readOnly: true
    },
    {
      header: "Name",
      accessor: "Name",
      dataType: "String"
    },
    {
      header: "Component",
      accessor: "Component",
      dataType: "String"
    },
    {
      header: "Properties",
      accessor: "Properties",
      dataType: "String"
    },
    {
      header: "Description",
      accessor: "Description",
      dataType: "String"
    },
    {
      header: "IsPublic",
      accessor: "IsPublic",
      dataType: "Boolean"
    }
  ];
  return (
    <>
      <LogiTable
        isRemoteLoading={isLoadingWidgets}
        dense={true}
        allowSort={false}
        columns={columns}
        keyAccessor="WidgetID"
        data={widgets}
        tableToolbar={(actionsAndStates: toolbarActionsAndState) => {
          return (
            <LogiStandardToolbar
              actionsAndStates={actionsAndStates}
              title={"Widgets"}
              insertNewRecord={async recordData => {
                const newData: any = actionsAndStates.insertedRecordData();
                try {
                  if (
                    !newData ||
                    (!newData.Name || newData.Name.trim().length <= 0)
                  ) {
                    alert("Please fill all required fields and try again");
                    return;
                  }
                  setIsLoadingWidgets(true);
                  await insertWidget(newData);
                  setRefreshTrigger(refreshTrigger ? refreshTrigger : 0 + 1);
                  actionsAndStates.discardInsertMode();
                  setIsLoadingWidgets(false);
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

export default Widgets;
