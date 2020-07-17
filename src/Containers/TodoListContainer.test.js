//import { unmountComponentAtNode, render } from 'react-dom';
import React from "react";
import { shallow } from 'enzyme'
import { TodoListItem } from '../Components/ToDoListItem';
import { ToDoList } from '../Components/ToDoList';
import { create } from 'react-test-renderer';

/**
 Testing units
 Rendering
 User events (Clicking, typing, checking)

 */

 const testItem = {
     id: 1,
     title: "Learn React",
     completed: false
 }

 const testItem2 = {
   id:2,
   title: "Learn React Part 2",
   completed: true
 }

 const todos =  [
        {
          userId: 1,
          id: 1,
          title: "Learn React",
          completed: false
        },
        {
          userId: 1,
          id: 2,
          title: "Conduct Internal VAPT",
          completed: false
        },
        {
          userId: 1,
          id: 3,
          title: "Physical Security",
          completed: false
        },
        {
          userId: 1,
          id: 4,
          title: "Application Security",
          completed: false
        }
      ]

describe('Testing todoList', () => {
    it('Shallow renders without crashing', () => {
        shallow(<ToDoList items={todos}/>)
    })

    it('ToDoList matches snapshot', () => {
        const todoList = create(<ToDoList items={todos} />).toJSON();
        expect(todoList).toMatchSnapshot();
    })

    it('Renders the correct number of todoListItem Components', () => {
      const wrapper = shallow(<ToDoList items={todos}/>)
      expect(wrapper.find(TodoListItem)).toHaveLength(4);
    })
})

describe('Testing todoListItem', () =>{
    it('Shallow renders without crashing', () => {
        shallow(<TodoListItem item={testItem} key={testItem.id} id={testItem.id} />)
    })
   
    it('TodoListItem matches a snapshot', () => {
       const todoListItem = create(<TodoListItem item={testItem} key={testItem.id} id={testItem.id} />).toJSON()
       expect(todoListItem).toMatchSnapshot();
    })

    it('Appropriate props are passed from parent', () => {
      let onClick, onChange, onMove;
      const todoItems = todos;
      onClick = onChange = onMove = jest.fn();
      const wrapper = shallow(<ToDoList items={todoItems} onClick={onClick} onChange={onChange} onMove={onMove}/>);
      const toDoListItemWrapper = wrapper.find(TodoListItem);
      toDoListItemWrapper.forEach((todoListItem) => {
        expect(todoListItem.props()).toEqual(expect.objectContaining({
          item: expect.any(Object),
          id: expect.any(Number),
          onClick: onClick,
          onChange: onChange,
          onMove: onMove
        }))
      })
    })

    it('has appropriate number of child components', () => {
      const wrapper = shallow(<TodoListItem item={testItem} key={testItem.id} id={testItem.id}/>);
      expect(wrapper.find('li')).toHaveLength(1);
      expect(wrapper.find('#delete')).toHaveLength(1);
      expect(wrapper.find('#move')).toHaveLength(1);
    })
    
    it('Passes appropriate props', () => {
      const onClick = jest.fn();
      const onMove = jest.fn();
      const onChange = jest.fn();
      const wrapper = shallow(<TodoListItem item={testItem} key={testItem.id} id={testItem.id} onClick={onClick} onChange={onChange} onMove={onMove}/>);
      expect(wrapper.find('label').text()).toEqual('Learn React');
      expect(wrapper.find('label').prop('style')).toEqual({textDecoration: "none"})
      expect(wrapper.find('input').props()).toEqual(expect.objectContaining({
        type: "checkbox",
        value: "Learn React",
        checked: false,
        onChange: expect.any(Function)
      }))
      expect(wrapper.find('#delete').prop('onClick')).toEqual(expect.any(Function))
      expect(wrapper.find("#move").prop('onClick')).toEqual(expect.any(Function))
    })

    it("Prop functions are called when events are triggered", () => {
      const onClick = jest.fn();
      const onMove = jest.fn();
      const onChange = jest.fn();
      const wrapper = shallow(<TodoListItem item={testItem2} key={testItem2.id} id={testItem.id} onClick={onClick} onChange={onChange} onMove={onMove}/>);
      const itemCheckBox = wrapper.find('input');
      const deleteButton = wrapper.find('#delete');
      const moveButton = wrapper.find('#move');
      itemCheckBox.prop('onChange')();
      expect(onChange).toHaveBeenCalled();
      expect(wrapper.find('label').prop('style')).toEqual({ textDecoration: "line-through", color: "grey" });
      deleteButton.prop('onClick')();
      expect(onClick).toHaveBeenCalled();
      moveButton.prop('onClick')();
      expect(onMove).toHaveBeenCalled();
    })
})
 