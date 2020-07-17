import React from 'react';
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import dayjs from 'dayjs'
import { changeDate } from '../redux/actions';
import { connect } from 'react-redux';
import { DATE_BACK, DATE_FORWARD } from '../redux/actionTypes';

function DateComponent(props){
    let today = (props.currentDate === dayjs().format("MM/DD/YYYY")) ? "Today" : dayjs(props.currentDate).format('ddd, MMM D, YYYY')
    return (
        <>
        <IconButton
        aria-label="delete"
        onClick={() => props.changeDate(DATE_BACK)}
        edge="end"
        className="p-2"
        size="small"
        id="back"
      >
        <ArrowBackIosIcon />
      </IconButton>
      <h1>{today}</h1>
      <IconButton
        aria-label="delete"
        onClick={() => props.changeDate(DATE_FORWARD)}
        edge="end"
        className="p-2"
        size='small'
        id="forward"
      >
        <ArrowForwardIosIcon />
      </IconButton>
      </>
    )
}

const mapStateToProps = (state) => {
  return {currentDate: state.date }
}

const mapDispatchToProps = dispatch => {
  return {
    changeDate: direction => {
      dispatch(changeDate(direction));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DateComponent);