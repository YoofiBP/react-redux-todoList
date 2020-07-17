import React from 'react';
import { create } from "react-test-renderer"
import { SignIn } from './Login';
import { shallow } from 'enzyme';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { spy } from 'sinon';

describe("Login Form component", () => {
    it("Matches the snapshot", () => {
        const wrapper = create(<SignIn />);
        const wrapperJSON = wrapper.toJSON()
        expect(wrapperJSON).toMatchSnapshot();
    });

    it("Has one form element", () => {
        const wrapper = shallow(<SignIn />)
        const formWrapper = wrapper.find('form');
        expect(formWrapper).toHaveLength(1);
    })

    it("Has TextField and Button elements", () => {
        const wrapper = shallow(<SignIn />)
        expect(wrapper.containsAllMatchingElements([TextField, Button])).toEqual(true)
    })

    it("Has one text and password field each", () => {
        const wrapper = shallow(<SignIn />)
        expect(wrapper.find(TextField)).toHaveLength(2);
        const types = wrapper.find(TextField).map((node) => node.prop('type'));
        expect(types).toEqual(['text', 'password'])
    })

    it("Has one submit button", () => {
        const wrapper = shallow(<SignIn />);
        expect(wrapper.find(Button).prop('type')).toEqual('submit')
    })

    it("Form fields should update on each key change", () => {
        const updateField = spy();
        const wrapper = shallow(<SignIn onChange={updateField} />);
        const textField = wrapper.find("#email");
        textField.simulate('change');

        expect(updateField.called).toEqual(true);

        const passwordField = wrapper.find("#password");
        passwordField.simulate('change');

        expect(updateField.calledTwice).toEqual(true);
    })
    
    it('Should submit when button is clicked', () => {
        const submitForm = spy();
        const wrapper = shallow(<SignIn onSubmit={submitForm} />);
        const submitButton = wrapper.find('form');
        submitButton.simulate('submit');

        expect(submitForm.calledOnce).toEqual(true);
    })
})