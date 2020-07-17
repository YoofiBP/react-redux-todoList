import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import dayjs from "dayjs";
import { DATE_BACK, DATE_FORWARD, ADD_TODO, CHECK_TODO, DELETE_TODO } from "./actionTypes";
import { todos } from '../todos';

const CURRENT_DATE = dayjs().format("MM/DD/YYYY");

const DateContainerReducer = (state = CURRENT_DATE, action) => {
  switch (action.type) {
    case DATE_BACK:
      return dayjs(state, "MM/DD/YYYY").subtract(1, "day").format("MM/DD/YYYY");
    case DATE_FORWARD:
      return dayjs(state, "MM/DD/YYYY").add(1, "day").format("MM/DD/YYYY");
    default:
      return state;
  }
};

let getTodos = () => {
    fetch('/todos.json')
    .then(res => res.json())
    .then(todos => todos)
    .catch(err => console.log(err))
}

const todoListReducer = (state = todos, action) => {
  let date, index;
  switch (action.type) {
    case ADD_TODO:
      date = action.payload.date;
      let newTask = {id: Math.random(), userId: 2, title: action.payload.title, completed: false};
      if (state.some(day => day.date === date)) {
        return state.map(day => {
          if (day.date === date) {
            return { date: day.date, tasks: [...day.tasks, newTask] };
          }
          return day;
        });
      } else {
        return [ ...state, { date: date, tasks: [newTask] } ];
      }
    case CHECK_TODO:
      date = action.payload.date;
      index = action.payload.index;
      return state.map(day => {
        if (day.date === date) {
          return { date: day.date, tasks: day.tasks.map(task => {
              return task.id === index ? Object.assign({}, task, {completed: !task.completed}) : task
            })
          };
        }
        return day;
      });
    case DELETE_TODO:
        date = action.payload.date;
        index = action.payload.index;
        return state.map(day => {
            if(day.date === date){
                return { date: day.date, tasks: day.tasks.filter(item => item.id !== index)
                }
            }
            return day
        });
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  date: DateContainerReducer,
  todoList: todoListReducer
});

export const store = createStore(rootReducer, composeWithDevTools());
