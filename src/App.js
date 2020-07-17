import React from "react";
import { Welcome } from "./Components/InputBox";
import DateComponent from './Components/DateComponent'
import ToDoList from './Components/ToDoList';
import InputBox from './Components/InputBox';
import "./App.css";

/*
App Array of Items Lives here
  Date Renders Based on Array of Items
  InputBoxContainer Renders based on Form Text
  TodoListContainer Renders Based on Array of Items
    TodoListItem

State:
Array of Items
Form Text
Date

================To dos==================
Implement DRY principle where applicable
Add comments and use descriptive names
Organization > Optimisation
Read popular source code
Take time to think about the problem before
Make this all much better
ß
Add move To tomorrow button
*/

export class App extends React.Component {
  constructor(props) {
    super(props);
    /** App State = todoItems (Array), currentDate (String) */
    this.state = {
      userId: this.props.userId,
    };
  }


  render() {
    let uid = 2;
    return (
      <>
      <div className="row justify-content-center">
      <Welcome userId={uid}/>
      </div>
        <div className="row justify-content-center">
          <DateComponent/>
        </div>
        <div className="row justify-content-center">
          <InputBox />
        </div>
        <div className="row justify-content-center">
          <div className="mx-auto col-5 border pt-2">
            <ToDoList/>
            <div style={{ textAlign: "center" }}>
              <button id="logout" className="btn btn-outline-secondary" onClick={this.props.logOut}>Logout</button>
            </div>
          </div>
        </div>
      </>
    );
  }
}
