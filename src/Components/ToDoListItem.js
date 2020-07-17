import React from "react";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import InputIcon from "@material-ui/icons/Input";
import dayjs from "dayjs";
import Tooltip from "@material-ui/core/Tooltip";

import { connect } from 'react-redux';
import { addItem, checkItem, deleteItem } from '../redux/actions';

function TodoListItem(props) {
  const { title, completed } = props.item;
  return (
    <div className="d-flex">
      <li>
        <input
          type="checkbox"
          value={title}
          checked={completed}
          className="mr-auto p-2"
          onChange={() => props.checkItem(props.id,props.currentDate)}
        />{" "}
        <label
          className="mr-auto p-2"
          style={
            completed
              ? { textDecoration: "line-through", color: "grey" }
              : { textDecoration: "none" }
          }
        >
          {title}
        </label>
        <Tooltip title="Delete">
          <IconButton
            aria-label="delete"
            onClick={() => props.deleteItem(props.id, props.currentDate)}
            edge="end"
            className="p-2"
            id="delete"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Do Tomorrow">
          <IconButton onClick={() => props.moveItem(props.id, props.currentDate, title)} id="move">
            <InputIcon />
          </IconButton>
        </Tooltip>
      </li>
    </div>
  );
}

const mapDispatchToProps = dispatch => {
  return {
    checkItem: (index, date) => {
      dispatch(checkItem(index, date))
    },
    deleteItem: (index, date) => {
      dispatch(deleteItem(index, date))
    },
    moveItem: (index, date, title) => {
      dispatch(deleteItem(index, date));
      date = dayjs(date, "MM/DD/YYYY").add(1, "day").format("MM/DD/YYYY")
      dispatch(addItem(title, date))
    }
  }
}

const mapStateToProps = state => {
  return {
      currentDate: state.date
  }
} 
export default connect(mapStateToProps, mapDispatchToProps)(TodoListItem);