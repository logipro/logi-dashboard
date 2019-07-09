import React, { useState } from "react";
import { Snackbar } from "@material-ui/core";
import clsx from "clsx";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import CloseIcon from "@material-ui/icons/Close";
import { amber, green } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import WarningIcon from "@material-ui/icons/Warning";
import { makeStyles, Theme } from "@material-ui/core/styles";

const snackbarContext = React.createContext({});

export const SnackbarProvider = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState();
  const [variant, setVariant] = useState<keyof typeof variantIcon>("info");

  const openSnackbar = (message: string, variant: keyof typeof variantIcon) => {
    setIsOpen(true);
    setMessage(message);
    setVariant(variant);
  };

  const closeSnackbar = () => {
    setIsOpen(false);
  };

  const { children } = props;

  return (
    <snackbarContext.Provider
      value={{
        openSnackbar: openSnackbar,
        closeSnackbar: closeSnackbar,
        snackbarIsOpen: isOpen,
        message: message
      }}
    >
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={isOpen}
        autoHideDuration={6000}
        onClose={closeSnackbar}
      >
        <LogiSnackbar
          onClose={closeSnackbar}
          variant={variant}
          message={message}
        />
      </Snackbar>
      {children}
    </snackbarContext.Provider>
  );
};

export function useSnackbar(): any {
  const context = React.useContext(snackbarContext);
  if (context === undefined) {
    throw new Error(`useSnackbar must be used within a Provider`);
  }
  return context;
}

/*
Copied from Material-UI example
*/
const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const useStyles = makeStyles((theme: Theme) => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.main
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: "flex",
    alignItems: "center"
  }
}));

export interface LogiSnackbarProps {
  className?: string;
  message?: string;
  onClose?: () => void;
  variant: keyof typeof variantIcon;
}

function LogiSnackbar(props: LogiSnackbarProps) {
  const classes = useStyles();
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>
      ]}
      {...other}
    />
  );
}
