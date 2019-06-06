import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button
} from "@material-ui/core";
import { useAsync } from "react-async";

type AuthContextType = {
  showLogin: Function;
  hideLogin: Function;
  LoggedInUserID: Number;
};

const AuthContext = React.createContext<Partial<AuthContextType>>({});

export function AuthProvider(props: any) {
  const [LoginVisible, setLoginVisible] = React.useState(false);
  const [LoggedInUserID, setLoggedInUserID] = React.useState<Number>();
  const [Token, setToken] = React.useState();
  const [initialLoad, setInitialLoad] = useState(true);
  const [initialLoadFailed, setInitialLoadFailed] = useState(false);

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

  async function getAccessibleApps() {
    console.log(Token);
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
    if (!result.ok) throw new Error(result.statusText);
    const res = await result.json();
    console.log(res);
    return res;
  }

  //---initial login
  React.useEffect(() => {
    async function initialTokenAndAppsLoad() {
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
        initialTokenAndAppsLoad();
      } catch (exception) {
        console.log(exception);
        setInitialLoadFailed(true);
      }
    }
  }, [initialLoad]);

  React.useEffect(() => {
    console.log("second use effect");
    console.log(Token);
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
    <AuthContext.Provider value={{ showLogin, hideLogin, LoggedInUserID }}>
      <Dialog
        open={LoginVisible}
        //onClose={() => this.handleCloseDialog()}
        aria-labelledby="login-title"
      >
        <DialogTitle id="flogin-title">Login</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter username and password
          </DialogContentText>
          <TextField
            id="username"
            label="Username"
            type="email"
            autoFocus
            margin="dense"
            required
            fullWidth
            //onChange={this.handleChange}
            //value={this.state.username}
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            margin="dense"
            required
            fullWidth
            //onChange={this.handleChange}
            //onKeyPress={this.enterPressed}
            //value={this.state.password}
          />
          {/* {this.props.LoginState === "Failed" && (
              <DialogContentText>Login failed</DialogContentText>
            )} */}
        </DialogContent>
        <DialogActions>
          <Button onClick={hideLogin} color="primary">
            Cancel
          </Button>
          <Button
            //onClick={this.handleLogin}
            color="primary"
            //   disabled={
            //     !(
            //       this.state.username.trim().length > 0 &&
            //       this.state.password.trim().length > 0
            //     )
            //   }
          >
            Login
          </Button>
          {/* {this.props.LoginState === "InProgress" && (
              <CircularProgress
                size={24}
                className={this.props.classes.buttonProgress}
              />
            )} */}
        </DialogActions>
      </Dialog>
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
