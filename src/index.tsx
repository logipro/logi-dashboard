import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "typeface-roboto";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Provider as ThemeProvider } from "./framework/Contexts/ThemeContext";
import { AuthProvider } from "./framework/Contexts/AuthContext";

const USE_STRICT_MODE = false;
const ReactMode = USE_STRICT_MODE ? React.StrictMode : React.Fragment;

ReactDOM.render(
  <ReactMode>
    <AuthProvider>
      <ThemeProvider>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <App />
      </ThemeProvider>
    </AuthProvider>
  </ReactMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
