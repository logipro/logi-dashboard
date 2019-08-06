import React, { useState } from "react";
import LoginDialog from "../layout/LoginDialog";

type AuthContextType = {
  showLogin: Function;
  hideLogin: Function;
  LoggedInUserID: Number;
  LoggedInUserName: String;
  AccessibleApps: Array<{}>;
  Token: String;
  AuthenticatedServerCall: Function;
  logout: Function;
};

const AuthContext = React.createContext<Partial<AuthContextType>>({});

export function AuthProvider(props: any) {
  const [LoginVisible, setLoginVisible] = React.useState(false);
  const [LoggedInUserID, setLoggedInUserID] = React.useState<Number>(-1);
  const [LoggedInUserName, setLoggedInUserName] = useState<String | undefined>(
    undefined
  );
  const [Token, setToken] = React.useState();
  const [initialLoad, setInitialLoad] = useState(true);
  const [initialLoadFailed, setInitialLoadFailed] = useState(false);
  const [AccessibleApps, setAccessibleApps] = useState();
  const [loginState, setloginState] = useState("");

  function showLogin() {
    setLoginVisible(true);
  }
  function hideLogin() {
    setLoginVisible(false);
  }
  function logout() {
    //console.log("logging out");
    setToken(undefined);
    setAccessibleApps([]);
    setLoggedInUserID(-1);
    setLoggedInUserName(undefined);
    //change the value for the get token to kick in
    setInitialLoad(true);
  }

  async function authenticateUser(username: String, password: String) {
    try {
      username = username.toLowerCase();
      setloginState("InProgress");
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json"
      };
      const rawResult = await fetch(`${process.env.REACT_APP_APIURL}login`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          username: username,
          password: password
        })
      });
      if (!rawResult.ok) {
        setloginState("Failed");
        //reset the token so will get new guest token
        setToken("");
        throw new Error(rawResult.statusText);
      }
      const result = await rawResult.json();
      setToken(result["token"]);
      setLoggedInUserID(result["userID"]);
      setLoggedInUserName(username);
      setloginState("Success");
      hideLogin();
    } catch (exception) {
      setloginState("Failed");
      setLoggedInUserID(-1);
      setLoggedInUserName(undefined);
      //reset the token so will get new guest token
      setToken("");
    }
  }

  const AuthenticatedServerCall = (
    url: string,
    method: string,
    body: any = undefined
  ) => {
    return new Promise((resolve, reject) =>
      fetch(url, {
        method: method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`
        },
        ...(body && { body: JSON.stringify(body) })
      }).then(response => {
        if (response.ok) {
          resolve(response.json());
        } else {
          //console.dir(response);
          if (response.status === 401) {
            //unauthorized
            //show login dialog (in case user can/wants to login)
            logout();
            setLoginVisible(true);
            reject("unauthorized/relogin");
          }
          reject(response.statusText);
        }
      })
    );
  };

  //---at initial load we will get a guest token and this will automatically cause fetching guest apps
  React.useEffect(() => {
    async function initialTokenFetch() {
      try {
        console.log("in guest token fetch");
        //get guest token then get accessible (public apps) and also set initial load to false
        const headers = {
          Accept: "application/json",
          "Content-Type": "application/json"
        };
        const result = await fetch(
          `${process.env.REACT_APP_APIURL}guesttoken`,
          {
            headers
          }
        );
        if (!result.ok) throw new Error(result.statusText);
        const res = await result.json();
        setToken(res["token"]);
        setLoggedInUserID(-1);
        setLoggedInUserName("guest");
        setInitialLoad(false);
      } catch (exception) {
        console.log(exception);
        setInitialLoadFailed(true);
      }
    }
    if (initialLoad) {
      try {
        initialTokenFetch();
      } catch (exception) {
        console.log(exception);
        setInitialLoadFailed(true);
      }
    }
  }, [initialLoad]);

  //if the token changes we re fetch the accessible apps
  React.useEffect(() => {
    async function getApps() {
      const getAccessibleApps = async function() {
        if (!Token) {
          return;
        }
        const headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`
        };
        const result = await fetch(
          `${process.env.REACT_APP_APIURL}accessibleapps`,
          {
            headers
          }
        );
        if (!result.ok) {
          setInitialLoadFailed(true);
          throw new Error(result.statusText);
        }
        const res = await result.json();
        let tempApps = res.filter(
          (app: any) => app.ParentID && app.ParentID === -1
        );
        tempApps.forEach((appGroup: any) => {
          let appsForGroup = res.filter((app: any) => {
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
          ...res.filter((app: any) => !app.ParentID || app.ParentID === null)
        );
        setAccessibleApps(
          tempApps.sort((appA: any, appB: any) => appA.AppOrder - appB.AppOrder)
        );

        return;
      };
      try {
        await getAccessibleApps();
      } catch (exception) {
        console.log(exception);
        setInitialLoadFailed(true);
      }
    }
    getApps();
  }, [Token]);

  if (initialLoadFailed) {
    return <div>Failed to initialize the app</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        showLogin,
        hideLogin,
        LoggedInUserID,
        LoggedInUserName,
        AccessibleApps,
        Token,
        AuthenticatedServerCall: AuthenticatedServerCall,
        logout: logout
      }}
    >
      <LoginDialog
        LoginVisible={LoginVisible}
        hideLogin={hideLogin}
        authenticateUser={(username: String, password: String) =>
          authenticateUser(username, password)
        }
        loginState={loginState}
      />
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context as AuthContextType;
}
