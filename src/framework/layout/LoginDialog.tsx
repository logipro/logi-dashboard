import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  makeStyles,
  CircularProgress
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";

const useStyles = makeStyles(theme => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    display: "flex",
    flexWrap: "wrap"
  },
  button: {
    margin: theme.spacing(3, 0, 2)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12
  }
}));

export default function LoginDialog(props: any) {
  const classes = useStyles();
  const [textValues, settextValues] = useState({ username: "", password: "" });

  const handleTextChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    settextValues({ ...textValues, [name]: event.target.value });
  };

  return (
    <Dialog
      open={props.LoginVisible}
      //onClose={() => this.handleCloseDialog()}
      aria-labelledby="login-title"
    >
      <DialogTitle id="flogin-title">Login</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter username and password
        </DialogContentText>
        <form className={classes.form} noValidate>
          <TextField
            value={textValues.username}
            onChange={handleTextChange("username")}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Username"
            name="email"
            autoComplete="email"
            autoFocus
            className={classes.textField}
          />
          <TextField
            value={textValues.password}
            onChange={handleTextChange("password")}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            className={classes.textField}
          />
        </form>
        {props.loginState === "Failed" && (
          <DialogContentText>Login failed</DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={props.hideLogin}
          color="primary"
          className={classes.button}
        >
          Cancel
        </Button>
        <Button
          className={classes.button}
          onClick={() =>
            props.authenticateUser(textValues.username, textValues.password)
          }
          color="primary"
          disabled={
            !(
              textValues.username.trim().length > 0 &&
              textValues.password.trim().length > 0
            )
          }
          type="submit"
        >
          Login
        </Button>
        {props.loginState === "InProgress" && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
      </DialogActions>
    </Dialog>
  );
}
