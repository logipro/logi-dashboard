import React, { useState, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { LogiTable, TableColumn } from "../Components/logi-table"; //"logi-table";

interface IRolesProps {}

const Roles: React.FunctionComponent<IRolesProps> = props => {
  const Auth: any = useAuth();
  const [roles, setRoles] = useState();
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
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
  }, []);

  async function insertRole(newData: any) {
    try {
      if (!newData.Role || !newData.Description) {
        return Promise.reject("Please fill all required fields");
      }
      var url = `${process.env.REACT_APP_APIURL}security/roles`;
      await Auth.AuthenticatedServerCall(url, "POST", {
        Insert: JSON.stringify({
          Role: (newData.Role as string).trim(),
          Description: (newData.Description as string).trim
        })
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
    //.then(response => this.fetchData())
    //.catch(error => this.fetchData());
  }

  const columns: TableColumn[] = [
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
        allowSelection={true}
        addNewRecord={async (newRow: any) => {
          return insertRole(newRow);
        }}
      />
    </>
  );
};

export default Roles;
