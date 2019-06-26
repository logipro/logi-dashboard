import React from "react";
import TextField from "@material-ui/core/TextField";
import DateFnsUtils from "@date-io/date-fns";
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import Checkbox from "@material-ui/core/Checkbox";
import ArrowForward from "@material-ui/icons/ArrowForward";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { TableColumn } from "./LogiTable";

interface IEditableTableCell {
  column: TableColumn;
  editMode?: boolean;
  dataRow: any;
  changeValue: (newValue: any) => void;
}

function EditableTableCell(props: IEditableTableCell) {
  if (props.editMode && !props.column.readOnly) {
    const onDateInputChange = (date: any) =>
      props.changeValue(date.toISOString());
    switch (props.column.dataType) {
      case "Date":
        return (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              autoOk={true}
              value={props.dataRow[props.column.accessor]}
              onChange={onDateInputChange}
              rightArrowIcon={<ArrowForward />}
              leftArrowIcon={<ArrowBack />}
            />
          </MuiPickersUtilsProvider>
        );
      case "Time":
        return (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <TimePicker
              value={props.dataRow[props.column.accessor]}
              onChange={onDateInputChange}
            />
          </MuiPickersUtilsProvider>
        );
      case "DateTime":
        return (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
              value={props.dataRow[props.column.accessor]}
              onChange={onDateInputChange}
              rightArrowIcon={<ArrowForward />}
              leftArrowIcon={<ArrowBack />}
            />
          </MuiPickersUtilsProvider>
        );
      case "Boolean":
        return (
          <Checkbox
            onChange={e => {
              props.changeValue(e.target.checked);
            }}
            checked={getBool()}
          />
        );
      case "Number":
      case "String":
      default:
        return (
          <TextField
            type={props.column.dataType === "Number" ? "number" : "text"}
            value={props.dataRow[props.column.accessor]}
            onChange={e => props.changeValue(e.target.value)}
          />
        );
    }
  } //read only mode
  else {
    switch (props.column.dataType) {
      case "Date":
        return (
          <React.Fragment>
            {new Date(
              props.dataRow[props.column.accessor]
            ).toLocaleDateString()}
          </React.Fragment>
        );
      case "DateTime":
        return (
          <React.Fragment>
            {new Date(props.dataRow[props.column.accessor]).toLocaleString()}
          </React.Fragment>
        );
      case "Time":
        return (
          <React.Fragment>
            {new Date(
              props.dataRow[props.column.accessor]
            ).toLocaleTimeString()}
          </React.Fragment>
        );
      case "Boolean":
        return <Checkbox checked={getBool()} />;
      default:
        return (
          <React.Fragment>
            {props.dataRow[props.column.accessor]}
          </React.Fragment>
        );
    }
  }

  function getBool(): boolean | undefined {
    switch (typeof props.dataRow[props.column.accessor]) {
      case "boolean":
        return props.dataRow[props.column.accessor];
      case "number":
        return props.dataRow[props.column.accessor] > 0 ? true : false;
      case "string":
        return (props.dataRow[
          props.column.accessor
        ] as string).toLowerCase() === "true"
          ? true
          : false;
      default:
        //a lot of times the type seems to be undefined!
        return props.dataRow[props.column.accessor];
    }
  }
}

export default EditableTableCell;
