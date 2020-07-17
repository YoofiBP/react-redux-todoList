import React from 'react';
import { create } from 'react-test-renderer';
import { shallow} from 'enzyme';
import { DateContainer, Welcome } from "./Containers/DateContainer";
import { ToDoListContainer } from "./Containers/TodoListContainer";
import { InputBoxContainer } from "./Containers/InputBoxContainer";
import {App} from './App';
import dayjs from "dayjs";
import { spy } from 'sinon';

it('renders without crashing', () => {
    shallow(<App/>);
})

it('Matches snapshot', () => {
        const app = create(<App />)
        let appJSON = app.toJSON();
        expect(appJSON).toMatchSnapshot();
})

it('Logout button executes prop when clicked', () => {
    const logoutSpy = spy();
    const wrapper = shallow(<App logOut={logoutSpy}/>)
    const logoutButton = wrapper.find('#logout');
    logoutButton.simulate('click');

    expect(logoutSpy.called).toEqual(true);
})

it("renders all children components", () => {
    const wrapper = shallow(<App />);
    expect(wrapper.containsAllMatchingElements([Welcome, DateContainer, ToDoListContainer, InputBoxContainer])).toEqual(true);
    expect(wrapper.find('#logout')).toHaveLength(1);
})

it("Has default state", () => {
    const wrapper = shallow(<App userId={1}/>);
    expect(wrapper.state('userId')).toEqual(expect.any(Number));
    expect(wrapper.state('todoItems')).toBeInstanceOf(Array);
    expect(wrapper.state('todoItems')[0]).toEqual(expect.objectContaining({
        date: expect.any(String),
        tasks: expect.any(Array)
    }))
    expect(wrapper.state('todoItems')[0].tasks[0]).toEqual(expect.objectContaining({
        userId: expect.any(Number),
        id: expect.any(Number),
        title: expect.any(String),
        completed: expect.any(Boolean)
    }));
    expect(wrapper.state('currentDate')).toEqual(expect.any(String))
})

it('Function to change date works', () => {
    const wrapper = shallow(<App />);
    const date = dayjs("05/03/1996").format("MM/DD/YYYY");
    wrapper.setState({currentDate: date});
    expect(wrapper.state('currentDate')).toEqual("05/03/1996");
    wrapper.instance().changeDate("back");
    expect(wrapper.state('currentDate')).toEqual("05/02/1996");
    wrapper.instance().changeDate("forward");
    expect(wrapper.state('currentDate')).toEqual("05/03/1996");
})

describe("Add, Delete, Move, Check Testing", () => {
    const wrapper = shallow(<App/>)
    let idx, title;

    beforeEach(() => {
    const date = dayjs("05/03/1996").format("MM/DD/YYYY");
    wrapper.setState({currentDate: date});
    wrapper.instance().changeItem('add', 'React testing with Jest');
    idx = wrapper.state('todoItems').filter(day => day.date === "05/03/1996")[0].tasks[0].id;
    title = wrapper.state('todoItems').filter(day => day.date === "05/03/1996")[0].tasks[0].title;
    })

    afterEach(() => {
        wrapper.instance().changeItem('delete', idx)
    })

    it("Add item functionality working", () => {
        expect(wrapper.state('todoItems')).toEqual(expect.arrayContaining([expect.objectContaining({
            date: "05/03/1996",
            tasks: expect.arrayContaining([{
            userId: expect.any(Number),
            id: expect.any(Number),
            title: "React testing with Jest",
            completed: false
            }])
        })]))
    })
    
    it("Delete functionality working", () => {
        wrapper.instance().changeItem('delete', idx);
        expect(wrapper.state('todoItems')).toEqual(expect.arrayContaining([expect.objectContaining({
            date: "05/03/1996",
            tasks: expect.not.arrayContaining([{
                userId: expect.any(Number),
                id: idx,
                title: "React testing with Jest",
                completed: false
            }])
        })]))
        })
    
        //REVISIT
    it("Move Item functionality working", () => {
        wrapper.instance().changeItem('move', idx+"/"+title);
        expect(wrapper.state('currentDate')).toEqual('05/04/1996')
        expect(wrapper.state('todoItems')).toEqual(expect.arrayContaining([expect.objectContaining({
            date: "05/03/1996",
            tasks: expect.not.arrayContaining([{
                userId: expect.any(Number),
                id: expect.any(Number),
                title: expect.any(String),
                completed: expect.any(Boolean)
            }])
        })]))
    })
        
    it("Check Item functionality working", () => {
        wrapper.instance().changeItem('check', idx);
        expect(wrapper.state('todoItems')).toEqual(expect.arrayContaining([expect.objectContaining({
            date: "05/03/1996",
            tasks: expect.arrayContaining([{
                userId: expect.any(Number),
                id: idx,
                title: "React testing with Jest",
                completed: true
            }])
        })]))
})

    it("Adds multiple items correctly", () => {
        wrapper.instance().changeItem('add', 'React testing with Jest 2');
        wrapper.instance().changeItem('add', 'React testing with Jest 3');
        wrapper.instance().changeItem('add', 'React testing with Jest 4');
        expect(wrapper.state('todoItems').filter(day => day.date === "05/03/1996")[0].tasks).toHaveLength(4);
    })
})

describe("Children have appropriate props", () => {
    const wrapper = shallow(<App userId={1}/>);
    let dateBackward, dateForward, date, changeItem, todoItems;

    beforeEach(() => {
        date = "05/03/1996";
        wrapper.setState({currentDate: date});
        dateForward = dateBackward = wrapper.instance().changeDate;
        changeItem = wrapper.instance().changeItem;
        todoItems = wrapper.state('todoItems').filter(day => day.date === date);
    })

    it("Welcome", () => {
        const welcomeWrapper = wrapper.find(Welcome);
        expect(welcomeWrapper.props()).toEqual(expect.objectContaining({
            userId: 1
        }))
    })

    it("DateContainer", () => {
        const dateContainerWrapper = wrapper.find(DateContainer);
        expect(dateContainerWrapper.props()).toEqual(expect.objectContaining({
            date: date,
            dateForward: dateForward,
            dateBackward: dateBackward
        }))
    })

    it("InputBoxContainer", () => {
        const inputBoxContainerWrapper = wrapper.find(InputBoxContainer);
        expect(inputBoxContainerWrapper.props()).toEqual(expect.objectContaining({
            onClick: changeItem
        }));
    })

    it("TodoListContainer", () => {
        const toDoListContainerWrapper = wrapper.find(ToDoListContainer);
        expect(toDoListContainerWrapper.props()).toEqual(expect.objectContaining({
            todoItems: todoItems,
            onClick: changeItem,
            onChange: changeItem,
            onMove: changeItem
        }))
    })
})

describe("Functions are binding properly", () => {
    const wrapper = shallow(<App userId={1}/>);
    const date = "05/03/1996";
    
    beforeEach(() => {
        wrapper.setState({currentDate: date});
    })
    it("DateContainer", () => {
        const dateContainerWrapper = wrapper.find(DateContainer);
        dateContainerWrapper.prop('dateForward')('forward');
        expect(wrapper.state('currentDate')).toEqual("05/04/1996");
        dateContainerWrapper.prop('dateForward')('back');
        expect(wrapper.state('currentDate')).toEqual("05/03/1996");
    })

    it("InputBoxContainer", () => {
        const inputBoxWrapper = wrapper.find(InputBoxContainer);
        inputBoxWrapper.prop('onClick')('add', "React Test 1");
        expect(wrapper.state('todoItems')).toEqual(expect.arrayContaining([expect.objectContaining({
            date: "05/03/1996",
            tasks: expect.arrayContaining([{
            userId: expect.any(Number),
            id: expect.any(Number),
            title: "React Test 1",
            completed: false
            }])
        })]))
    })

    //FINISH TESTING BINDING OF METHODS TO CHILD COMPONENTS
    it("ToDoListContainer", () => {
        const todoListWrapper = wrapper.find(ToDoListContainer);
        wrapper.setState({currentDate: "03/17/2020"});
        todoListWrapper.prop('onClick')('delete', 1);
        expect(wrapper.state('todoItems')).toEqual(expect.arrayContaining([expect.objectContaining({
            date: "03/17/2020",
            tasks: expect.not.arrayContaining([{
                userId: 1,
                id: 1,
                title: "Learn React",
                completed:false
            }])
        })]))

        todoListWrapper.prop('onMove')('move', "2/Conduct Internal Vapt");
        expect(wrapper.state('todoItems')).toEqual(expect.arrayContaining([expect.objectContaining({
            date: "03/17/2020",
            tasks: expect.not.arrayContaining([{
                userId: 1,
                id: 2,
                title: "Conduct Internal VAPT",
                completed: false
            }])
        })]))

        wrapper.setState({currentDate: "03/17/2020"});
        todoListWrapper.prop('onChange')('check', 3);
        expect(wrapper.state('todoItems')).toEqual(expect.arrayContaining([expect.objectContaining({
            date: "03/17/2020",
            tasks: expect.arrayContaining([{
                userId: expect.any(Number),
                id: 3,
                title: expect.any(String),
                completed: true
            }])
        })]))
    })
    
})

