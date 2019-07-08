import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";
import Icon from "@material-ui/core/Icon";
import { makeStyles } from "@material-ui/core/styles";

const useStyle = makeStyles(theme => ({
  card: {
    display: "flex",
    height: "90px"
  },
  details: {
    display: "flex",
    flexDirection: "column"
  },
  content: {
    flex: "auto 0 1"
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  iconContainer: {
    background: "rgba(0,0,0,0.2)",
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    height: "90px",
    width: "90px"
  },
  icon: {
    fontSize: "45px"
  }
}));

function InfoCard(props) {
  const classes = useStyle();
  const dynamicProps = JSON.parse(props.widgetInfo.Properties);
  return (
    <Card
      className={classes.card}
      style={{ background: dynamicProps.Background }}
    >
      <div className={classes.iconContainer}>
        <Icon
          className={classes.icon}
          dangerouslySetInnerHTML={{ __html: dynamicProps.Icon }}
        />
      </div>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
            {dynamicProps.Subject}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {dynamicProps.Text}
          </Typography>
        </CardContent>
        <div className={classes.controls} />
      </div>
    </Card>
  );
}

export default InfoCard;
