import * as React from "react";

export interface IDashboardProps {}

const Dashboard = function(props: IDashboardProps) {
  console.log("in");
  const [state, setstate] = React.useState(0);
  React.useEffect(() => {
    setstate(state + 1);
  }, []);
  return <div>DASHBOARD {state}</div>;
};

export default Dashboard;
