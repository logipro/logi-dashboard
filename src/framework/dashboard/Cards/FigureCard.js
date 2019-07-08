import React from "react";
import classnames from "classnames";
import { Card, Icon, CircularProgress } from "@material-ui/core/";

/* TODO: if the image doesn't exist at the moment it throws a fatal error, needs to be changed
                    so the application will still come up */

class FigureCard extends React.Component {
  constructor(props) {
    super(props);
    this.refreshContent = this.refreshContent.bind(this);
  }
  timer = null;
  refreshContent() {
    this.props.onTimerTick(
      this.props.JwtToken,
      this.props.widgetID,
      this.props.dynamicProps.customerID
        ? this.props.dynamicProps.customerID
        : -1
    );
    this.timer = setTimeout(
      this.refreshContent,
      this.props.dynamicProps.refreshTimer
        ? this.props.dynamicProps.refreshTimer
        : 10000
    );
    this.classes = {};
  }
  componentDidMount() {
    //---request data
    //---start the timer to fetch data and refresh content
    this.timer = setTimeout(
      this.refreshContent,
      this.props.dynamicProps.refreshTimer
        ? this.props.dynamicProps.refreshTimer
        : 10000
    );
  }
  componentWillUnmount() {
    //---remove the timer
    clearInterval(this.timer);
  }

  render() {
    return (
      /* <Grid
        item
        xs={12}
        sm={12}
        md={6}
        lg={3}
        xl={3}
        style={{ paddingLeft: 8, paddingRight: 8, marginBottom: 30 }}
      > */
      <Card
        title={
          <div>
            <div
              className={classnames("card-header", {
                [this.props.dynamicProps.color]: true
              })}
            >
              <h4>
                <img alt={"logo"} width={"70px"} />
              </h4>
            </div>
            <div className={"card-content"}>
              <p className={"category"}>{this.props.dynamicProps.title}</p>
              <h3>
                {this.props.content ? (
                  this.props.content
                ) : (
                  <CircularProgress color="secondary" />
                )}
              </h3>
            </div>
          </div>
        }
      >
        <div className={"card-footer"}>
          <Icon type={this.props.dynamicProps.subIcon} />{" "}
          {this.props.dynamicProps.sub}
        </div>
      </Card>
    );
  }
}

export default FigureCard;
