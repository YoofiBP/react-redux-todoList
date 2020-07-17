import React from 'react';
import TodoListItem from './ToDoListItem'
import { connect } from 'react-redux'

function ToDoList(props) {
    return (
        props.items.map(item => <TodoListItem item={item} key={item.id} id={item.id}/>)
    )
}

const mapStateToProps = state => {
    let [todaysItems] = state.todoList.filter(day => day.date === state.date)
    return todaysItems ? { items: todaysItems.tasks } : { items: [] }
}

export default connect(mapStateToProps)(ToDoList);