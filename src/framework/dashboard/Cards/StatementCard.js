import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyle = makeStyles(theme => ({
  card: {},
  title: {
    marginBottom: 16,
    fontSize: 14
  }
}));

function StatementCard(props) {
  const classes = useStyle();
  const dynamicProps = JSON.parse(props.widgetInfo.Properties);
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary">
          {dynamicProps.Title}
        </Typography>
        {dynamicProps.Message ? (
          <Typography variant="body2" component="p">
            {dynamicProps.Message}
          </Typography>
        ) : null}
        {dynamicProps.HTMLMessage ? (
          <div dangerouslySetInnerHTML={{ __html: dynamicProps.HTMLMessage }} />
        ) : null}
      </CardContent>
    </Card>
  );
}

export default StatementCard;
