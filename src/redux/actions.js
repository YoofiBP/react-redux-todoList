import { ADD_TODO, CHECK_TODO, DELETE_TODO } from './actionTypes';

export const changeDate = (direction) => {
    return { type: direction}
  }

export const addItem = (title, date) => {
    return { 
        type: ADD_TODO,
        payload: {
            title: title,
            date: date
        }}
}
  
export const checkItem = (idx, date) => {
    return {
        type: CHECK_TODO,
        payload: {
            index: idx,
            date: date
        }
    }
}

export const deleteItem = (idx, date) => {
    return {
        type: DELETE_TODO,
        payload: {
            index: idx,
            date: date
        }
    }
}