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
import { Value2SQLValue } from "../utils/helpers";

const Apps: React.FunctionComponent = function(props: any) {
  console.log(props);
  const [apps, setApps] = useState();
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const Auth: any = useAuth();
  useEffect(() => {
    async function fetchRoles() {
      setIsLoadingApps(true);
      var url = `${process.env.REACT_APP_APIURL}security/apps`;
      let roles = await Auth.AuthenticatedServerCall(url, "GET");
      setApps(roles);
      setIsLoadingApps(false);
    }
    fetchRoles();
  }, [Auth, refreshTrigger]);

  async function insertApp(newData: any) {
    try {
      var url = `${process.env.REACT_APP_APIURL}security/apps`;

      await Auth.AuthenticatedServerCall(url, "POST", {
        Insert: ` ("Application", "ParentID", "Description", "RouteName", "Component", "Params", "ShowInNavigationTree", "IsPublic", "Icon", "AppOrder","AppProps")
          SELECT '${newData.Application.trim()}' ,
        ${newData.ParentID ? newData.ParentID : null} ,
        '${newData.Description.trim()}', 
        '${newData.RouteName.trim()}', 
        '${newData.Component.trim()}', 
        '${newData.Params.trim().length > 0 ? newData.Params.trim() : null}', 
        ${
          newData.ShowInNavigationTree !== undefined
            ? Value2SQLValue.get("Boolean")(newData.ShowInNavigationTree)
            : null
        }, 
        ${
          newData.IsPublic !== undefined
            ? Value2SQLValue.get("Boolean")(newData.IsPublic)
            : null
        }, 
        '${newData.Icon.trim()}',
         ${newData.AppOrder ? newData.AppOrder : null},
         '${
           newData.AppProps.trim().length > 0 ? newData.AppProps.trim() : null
         }', 
      `
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async function deleteApp(ApplicationID: number) {
    try {
      var url = `${process.env.REACT_APP_APIURL}security/apps`;
      let a = await Auth.AuthenticatedServerCall(url, "DELETE", {
        ApplicationID: ApplicationID
      });
      console.log(a);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  //ignoring the error about empty value in readonly case!
  //@ts-ignore
  const columns: TableColumn[] = [
    ...(props.loadedProps &&
    props.loadedProps.ReadOnly &&
    props.loadedProps.ReadOnly === "true"
      ? []
      : [
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
                          `Are you sure you want to delete ${row.Application} ?`
                        )
                      ) {
                        setIsLoadingApps(true);
                        await deleteApp(row.ApplicationID);
                        setRefreshTrigger(refreshTrigger => refreshTrigger + 1);
                        setIsLoadingApps(false);
                      }
                    }}
                    saveChanges={(): Promise<boolean> => {
                      //go through the new Data and create the update statement
                      let updateStatement: String = "";
                      for (let key in rowAsAndSs.newData) {
                        if (typeof rowAsAndSs.newData[key] === "boolean") {
                          rowAsAndSs.newData[key] = Value2SQLValue.get(
                            "Boolean"
                          )(rowAsAndSs.newData.IsPublic);
                        }
                        if (
                          rowAsAndSs.newData[key] !== rowAsAndSs.oldData[key]
                        ) {
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
                          `${process.env.REACT_APP_APIURL}security/apps`,
                          "PUT",
                          {
                            ApplicationID: rowAsAndSs.oldData.ApplicationID,
                            Update: updateStatement
                          }
                        )
                          .then((r: any) => {
                            console.log(r);
                            setRefreshTrigger(
                              refreshTrigger => refreshTrigger + 1
                            );
                          })
                          .catch((error: any) => {
                            console.log(error);
                            rowAsAndSs.discardEditMode();
                            setRefreshTrigger(
                              refreshTrigger => refreshTrigger + 1
                            );
                          });
                      }
                      return Promise.resolve(true);
                    }}
                  />
                </>
              );
            }
          }
        ]),
    {
      header: "ApplicationID",
      accessor: "ApplicationID",
      dataType: "Number",
      readOnly: true
    },
    {
      header: "Application",
      accessor: "Application",
      dataType: "String"
    },
    {
      header: "Description",
      accessor: "Description",
      dataType: "String"
    },
    {
      header: "ParentID",
      accessor: "ParentID",
      dataType: "Number"
    },
    {
      header: "RouteName",
      accessor: "RouteName",
      dataType: "String"
    },
    {
      header: "Component",
      accessor: "Component",
      dataType: "String"
    },
    {
      header: "Props",
      accessor: "AppProps",
      dataType: "String"
    },
    {
      header: "Params",
      accessor: "Params",
      dataType: "String"
    },
    {
      header: "IsPublic",
      accessor: "IsPublic",
      dataType: "Boolean"
    },
    {
      header: "ShowInNavigationTree",
      accessor: "ShowInNavigationTree",
      dataType: "Boolean"
    },
    {
      header: "Icon",
      accessor: "Icon",
      dataType: "String"
    },
    {
      header: "AppOrder",
      accessor: "AppOrder",
      dataType: "Number"
    }
  ];
  return (
    <>
      <LogiTable
        isRemoteLoading={isLoadingApps}
        dense={true}
        allowSort={false}
        columns={columns}
        keyAccessor="ApplicationID"
        data={apps}
        tableToolbar={(actionsAndStates: toolbarActionsAndState) => {
          return (
            <LogiStandardToolbar
              actionsAndStates={actionsAndStates}
              title={"Applications"}
              insertNewRecord={async recordData => {
                if (
                  props.loadedProps &&
                  props.loadedProps.ReadOnly &&
                  props.loadedProps.ReadOnly === "true"
                ) {
                  alert("This is read only mode of the app");
                  return;
                }
                const newData: any = actionsAndStates.insertedRecordData();
                try {
                  if (
                    !newData ||
                    (!newData.Application ||
                      newData.Application.trim().length <= 0)
                  ) {
                    alert("Please fill all required fields and try again");
                    return;
                  }
                  setIsLoadingApps(true);
                  await insertApp(newData);
                  setRefreshTrigger(refreshTrigger => refreshTrigger + 1);
                  actionsAndStates.discardInsertMode();
                  setIsLoadingApps(false);
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

export default Apps;
