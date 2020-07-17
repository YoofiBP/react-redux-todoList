import React from 'react';
import { DateComponent } from '../Components/DateComponent'
import { shallow } from 'enzyme';
import { Welcome } from './DateContainer'
import { create } from 'react-test-renderer';
import dayjs from "dayjs";

const testDate = dayjs("03/17/2020").format("MM/DD/YYYY")
const testUserId = 1;

describe('DateComponent Tests', () => {
    it('renders DateComponent without crashing', () => {
        shallow(<DateComponent />);
    })
    
    it('DateComponent matches snapshot', () => {
        const dateComponent = create(<DateComponent date={testDate}/>);
        expect(dateComponent.toJSON()).toMatchSnapshot();
    })  

    it('Renders today when today', () => {
        const date = dayjs().format("MM/DD/YYYY");
        const dateComponentWrapper = shallow(<DateComponent date={date}/>);
        expect(dateComponentWrapper.text()).toEqual("Today")
    })

    it('OnClick listeners working', () => {
        const dateBackward = jest.fn();
        const dateForward = jest.fn();
        const dateComponentWrapper = shallow(<DateComponent dateForward={dateForward} dateBackward={dateBackward}/>);
        const backbutton = dateComponentWrapper.find("#back");
        backbutton.simulate('click');
        expect(dateBackward).toHaveBeenCalled();
        const forwardbutton = dateComponentWrapper.find("#forward");
        forwardbutton.simulate('click');
        expect(dateForward).toHaveBeenCalled();
    })
})

describe('Welcome Tests', () => {
    it("Welcome component matches snapshot", () => {
        const welcome = create(<Welcome userId={testUserId}/>);
        expect(welcome.toJSON()).toMatchSnapshot()
    })

    it("Renders welcome text", () => {
        const welcomeWrapper = shallow(<Welcome userId={testUserId}/>);
        expect(welcomeWrapper.text()).toEqual("Welcome, Yoofi!")
    })
})

