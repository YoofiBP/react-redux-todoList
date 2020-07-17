import React from 'react';
import {InputBox} from '../Components/InputBox'
import { shallow } from 'enzyme';
import { create } from 'react-test-renderer';


describe('InputBox Component tests', () => {
  it('shallow renders without crashing', () => {
    shallow(<InputBox />)
  })

  it('InputBox component matches snapshot', () => {
    const inputBox = create(<InputBox />);
    const JSON = inputBox.toJSON();
    expect(JSON).toMatchSnapshot();
  })

  it("Renders one form element with text input box and submit button", () => {
    const inputBoxWrapper = shallow(<InputBox />);
    expect(inputBoxWrapper.find('form')).toHaveLength(1);
    const expected = ['text', 'submit'];
    const types = inputBoxWrapper.find('input').map((node) => node.prop('type'))
    expect(types).toEqual(expect.arrayContaining(expected));
  })

  it("Has default state", () => {
    const inputBoxWrapper = shallow(<InputBox />);
    expect(inputBoxWrapper.state('value')).toBeFalsy();
  })

  it("Updates value state", () => {
    const inputBoxWrapper = shallow(<InputBox />);
    const event = {
      target: {
        value: "JollyRancher"
      }
    }
    inputBoxWrapper.instance().handleChange(event)
    expect(inputBoxWrapper.state('value')).toEqual("JollyRancher");
  })

  it("Validates and submits value", () => {
    const onClick = jest.fn();
    const inputBoxWrapper = shallow(<InputBox onClick={onClick}/>);
    let event = {
      target: {
        value: "J"
      },
      preventDefault: () => {}
    }
    inputBoxWrapper.instance().handleChange(event)
    inputBoxWrapper.instance().handleSubmit(event);
    expect(onClick).not.toHaveBeenCalled();

    event = {
      target: {
        value: "Testing with Jest"
      },
      preventDefault: () => {}
    }
    inputBoxWrapper.instance().handleChange(event)
    inputBoxWrapper.instance().handleSubmit(event);
    expect(onClick).toHaveBeenCalled();
    expect(inputBoxWrapper.state('value')).toBeFalsy();
  })

  it('Passes functions to appropriate children', () => {
    const inputBoxWrapper = shallow(<InputBox />);
    const handleChange = inputBoxWrapper.instance().handleChange;
    const handleSubmit = inputBoxWrapper.instance().handleSubmit;
    expect(inputBoxWrapper.find("#title").prop('onChange')).toEqual(handleChange)
    expect(inputBoxWrapper.find('form').prop('onSubmit')).toEqual(handleSubmit)
  })

  it("Binds functions appropriately", () => {
    const onClick = jest.fn();
    const inputBoxWrapper = shallow(<InputBox onClick={onClick}/>);
    const inputfield = inputBoxWrapper.find('#title');
    const formComponent = inputBoxWrapper.find('form');
    const event = {
      target: {
        value: "Testing with Jest"
      },
      preventDefault: () => {}
    }
    inputfield.prop('onChange')(event)
    expect(inputBoxWrapper.state('value')).toEqual('Testing with Jest')
    formComponent.prop('onSubmit')(event)
    expect(onClick).toHaveBeenCalled();
    expect(inputBoxWrapper.state('value')).toBeFalsy();
  })
})

//Items below 4 chars should not call onClick