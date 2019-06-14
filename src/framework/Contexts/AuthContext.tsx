import React, { useState } from "react";
import LoginDialog from "../layout/LoginDialog";

type AuthContextType = {
  showLogin: Function;
  hideLogin: Function;
  LoggedInUserID: Number;
  AccessibleApps: Array<{}>;
};

const AuthContext = React.createContext<Partial<AuthContextType>>({});

export function AuthProvider(props: any) {
  const [LoginVisible, setLoginVisible] = React.useState(false);
  const [LoggedInUserID, setLoggedInUserID] = React.useState<Number>();
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

  async function getGuestToken() {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };
    const result = await fetch(`${process.env.REACT_APP_APIURL}guesttoken`, {
      headers
    });
    if (!result.ok) throw new Error(result.statusText);
    const res = await result.json();
    setToken(res["token"]);
    setLoggedInUserID(res["userID"]);
    return res;
  }

  async function authenticateUser(username: String, password: String) {
    try {
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
      setloginState("Success");
      hideLogin();
    } catch (exception) {
      setloginState("Failed");
      //reset the token so will get new guest token
      setToken("");
    }
  }

  async function getAccessibleApps() {
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
  }

  //---at initial load we will get a guest token and this will automatically cause fetching guest apps
  React.useEffect(() => {
    async function initialTokenFetch() {
      try {
        console.log(initialLoad);
        //get guest token then get accessible (public apps) and also set initial load to false
        await getGuestToken();
        //await getAccessibleApps();
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
        AccessibleApps
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

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}
