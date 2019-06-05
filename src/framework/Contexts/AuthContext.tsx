import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button
} from "@material-ui/core";

type AuthContextType = {
  showLogin: Function;
  hideLogin: Function;
  LoggedInUser: String;
};

const AuthContext = React.createContext<Partial<AuthContextType>>({});

export function AuthProvider(props: any) {
  const [LoginVisible, setLoginVisible] = React.useState(false);
  const [LoggedInUser, setLoggedInUser] = React.useState("Guest");

  function showLogin() {
    setLoginVisible(true);
  }
  function hideLogin() {
    setLoginVisible(false);
  }

  //---initial guest login
  React.useLayoutEffect(() => {
    console.log("run the first guest login here");
  }, [LoggedInUser]);

  return (
    <AuthContext.Provider value={{ showLogin, hideLogin, LoggedInUser }}>
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

function LoginDialog(props: any) {
  return (
    <Dialog
      open={true}
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
        <Button
          //   onClick={() => {
          //     //get guest token
          //     this.props.cancelLogin();
          //     //close the dialog
          //     this.handleCloseDialog();
          //   }}
          color="primary"
        >
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
  );
}
