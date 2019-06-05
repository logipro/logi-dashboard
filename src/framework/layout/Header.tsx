import React from "react";
import clsx from "clsx";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Tooltip from "@material-ui/core/Tooltip";
import HighlightIcon from "@material-ui/icons/Highlight";
import HighlightOutlinedIcon from "@material-ui/icons/HighlightOutlined";
import { useChangeTheme } from "../Contexts/ThemeContext";
import { useTheme } from "@material-ui/styles";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    menuButton: {
      marginRight: 36
    },
    hide: {
      display: "none"
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap"
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1
      }
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3)
    },
    grow: {
      flex: "1 1 auto"
    }
  })
);

function Header(props: any) {
  const classes = useStyles();
  const { sidebarOpen, setSidebarOpen } = props;

  function handleDrawerOpen() {
    setSidebarOpen(true);
  }

  const theme: Theme = useTheme();
  const changeTheme = useChangeTheme();
  function handleTogglePaletteType() {
    const paletteType = theme.palette.type === "light" ? "dark" : "light";

    changeTheme({ paletteType });
  }

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: sidebarOpen
      })}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          className={clsx(classes.menuButton, {
            [classes.hide]: sidebarOpen
          })}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          LogiPro Dashboard
        </Typography>
        <div className={classes.grow} />
        <Tooltip title={"toggleTheme"} enterDelay={300}>
          <IconButton
            color="inherit"
            onClick={handleTogglePaletteType}
            aria-label={"toggleTheme"}
            data-ga-event-category="AppBar"
            data-ga-event-action="dark"
          >
            {theme.palette.type === "light" ? (
              <HighlightOutlinedIcon />
            ) : (
              <HighlightIcon />
            )}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
