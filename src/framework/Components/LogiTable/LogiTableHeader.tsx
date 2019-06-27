import React, { useState } from "react";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { Order, TableColumn } from "./LogiTable";
import AddIcon from "@material-ui/icons/Add";
import { IconButton } from "@material-ui/core";

export function LogiTableHeader(props: {
  onSelectAllClick?: any;
  columns: TableColumn[];
  customSortFunction?: any;
  allowSelection?: boolean;
  showSelectAll?: boolean;
  allowEdit?: boolean;
  allowDelete?: boolean;
  allowAddNew?: boolean;
  allowSort?: boolean;
  addingNewRecord: () => void;
}) {
  const { onSelectAllClick, columns } = props;

  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState("");

  const createSortHandler = (clickedColumn: TableColumn) => (
    event: React.MouseEvent<unknown>
  ) => {
    if (props.customSortFunction)
      props.customSortFunction(event, clickedColumn);
    else {
      const isDesc = orderBy === clickedColumn.header && order === "desc";
      setOrder(isDesc ? "asc" : "desc");
      setOrderBy(clickedColumn.header);
    }
  };

  return (
    <TableHead>
      <TableRow>
        {props.allowSelection ? (
          <TableCell padding="checkbox">
            {props.showSelectAll ? (
              <Checkbox
                //TODO: fix the checked state for select all
                checked={true}
                onChange={onSelectAllClick}
                inputProps={{ "aria-label": "Select all" }}
              />
            ) : null}
          </TableCell>
        ) : null}
        {props.allowEdit || props.allowDelete || props.allowAddNew ? (
          <TableCell>
            {props.allowAddNew ? (
              <AddButton onExecute={() => props.addingNewRecord()} />
            ) : null}
          </TableCell>
        ) : null}
        {columns.map(col =>
          col.hidden ? null : (
            <TableCell
              key={col.accessor}
              align={col.dataType === "Number" ? "right" : "left"}
              padding={col.disablePadding ? "none" : "default"}
              sortDirection={orderBy === col.header ? order : false}
            >
              {props.allowSort && !(col.dataType === "ActionColumn") ? (
                <TableSortLabel
                  active={orderBy === col.header}
                  direction={order}
                  onClick={createSortHandler(col)}
                >
                  {col.header}
                </TableSortLabel>
              ) : (
                col.header
              )}
            </TableCell>
          )
        )}
      </TableRow>
    </TableHead>
  );
}

const AddButton = (props: any) => (
  <IconButton color="secondary" onClick={props.onExecute} title="Add Record">
    <AddIcon />
  </IconButton>
);
