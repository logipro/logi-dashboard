import React, { useEffect, useState } from "react";
import { useAuth } from "../../framework/Contexts/AuthContext";
import { makeStyles } from "@material-ui/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import Paper from "@material-ui/core/Paper";

import QueueJobRow from "./QueueJobRow";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3)
  },
  table: {},
  tableWrapper: {
    overflowX: "auto"
  }
}));

function QueueJobs(props) {
  const Auth = useAuth();
  const classes = useStyles();
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = React.useState(0);

  useEffect(() => {
    const getJobs = async function(queueName, state, start, end) {
      try {
        const url = `${
          process.env.REACT_APP_TASK_MANAGEMENT_URL
        }queues/job/${queueName}&${state}&${start}&${end}`;
        const fetchedJobs = await Auth.AuthenticatedServerCall(url, "GET");
        setJobs(fetchedJobs);
      } catch (error) {
        console.log({ error, loading: false });
      }
    };
    getJobs(props.queueName, props.state, page * 10, (page + 1) * 10);
    let nPage = page;
    setPage(nPage);
  }, [page, props.refresh, props.queueName, props.state, Auth]);

  return (
    <Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell align="justify" />
              <TableCell>ID</TableCell>
              <TableCell align="right">Created</TableCell>
              <TableCell align="right">Waited</TableCell>
              <TableCell align="right">Processed</TableCell>
              <TableCell align="right">Finished</TableCell>
              <TableCell align="right">Run</TableCell>
              <TableCell align="right">attempts</TableCell>
              <TableCell align="center">action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map(row => (
              <QueueJobRow
                key={row.id}
                row={row}
                classes={classes}
                queueName={props.queueName}
                state={props.state}
                requestRefresh={() => props.requestRefresh()}
              />
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={3}
                count={props.jobsLength}
                rowsPerPageOptions={[10]}
                rowsPerPage={10}
                page={page}
                SelectProps={{
                  native: true
                }}
                onChangePage={(e, newPage) => {
                  setPage(newPage);
                }}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </Paper>
  );
}

export default QueueJobs;
