import React from 'react';
//import ReactDOM from 'react-dom'
import { create } from 'react-test-renderer';
import { Index } from './index';
import { shallow } from 'enzyme';
import { SignIn } from './Components/Login';

import TextField from '@material-ui/core/TextField';
import {App} from './App';
//import { render, fireEvent } from '@testing-library/react'

const event = {
    preventDefault: () => {}
}

let login = (wrapper, accurate) => {
    wrapper.instance().handleChange({
        target: {
            value: accurate ? "effie@kpmg.com" : "wrong@credentials.com", 
            name:"email"
        }
    })
    wrapper.instance().handleChange({
        target: {
            value: accurate ? "kpmg1234" : "doesntmatter", 
            name:"password"
        }
    }) 
}

describe('Index component testing', () => {
    it('renders without crashing', () => {
        shallow(<Index />)
    })
    
    it('Matches snapshot', () => {
        const index = create(<Index/>);
        const indexJSON = index.toJSON();
        
        expect(indexJSON).toMatchSnapshot();
    })
    
    it('renders SignIn first', () => {
        const wrapper = shallow(<Index/>);
        expect(wrapper.find(SignIn)).toHaveLength(1);
    })
    
    it("Has default state", () => {
        const wrapper = shallow(<Index/>);
        expect(wrapper.state('auth')).toBeFalsy();
        expect(wrapper.state('userId')).toBeFalsy();
        expect(wrapper.state('email')).toBeFalsy();
        expect(wrapper.state('password')).toBeFalsy();
    })
    
    it('Changes form value and submits to change state', () => {
        window.alert = () => {};
    
        const wrapper = shallow(<Index />); 
       
        login(wrapper, true);
        expect(wrapper.state('email')).toBeTruthy();
        expect(wrapper.state('password')).toBeTruthy();
    
        wrapper.instance().handleSubmit(event)
    
        expect(wrapper.state('auth')).toBeTruthy();
    
        wrapper.instance().logOut();
    
        expect(wrapper.state('auth')).toBeFalsy();
    
    })
    
    it('Does not change auth to true with wrong credentials', () => {
        window.alert = () => {};
        const event = {
            preventDefault: () => {}
        }
        const wrapper = shallow(<Index />)
    
        login(wrapper, false);
        expect(wrapper.state('email')).toBeTruthy();
        expect(wrapper.state('password')).toBeTruthy();
    
        wrapper.instance().handleSubmit(event)
    
        expect(wrapper.state('auth')).toBeFalsy();
    })
    
    it("Passes functions to children as props", () => {
        const wrapper = shallow(<Index />);
        const handleChange = wrapper.instance().handleChange;
        const handleSubmit = wrapper.instance().handleSubmit;
        const logOut = wrapper.instance().logOut;
    
        const signIn = wrapper.find(SignIn);
        expect(signIn.props()).toEqual(expect.objectContaining({
            onChange: handleChange,
            onSubmit: handleSubmit
        }))

        login(wrapper, true);
        wrapper.instance().handleSubmit(event)
        const app = wrapper.find(App);
        expect(app.props()).toEqual(expect.objectContaining({
            logOut: logOut,
            userId: expect.any(Number)
        }))
    })
    
    it("Binds functions accordingly", () => {
        const wrapper = shallow(<Index />);
        const signInBox = wrapper.find(SignIn);
        
        signInBox.prop('onChange')({
            target: {
                value: "effie@kpmg.com",
                name: "email"
            }
        })
    
        signInBox.prop('onChange')({
            target: {
                value: "kpmg1234",
                name: "password"
            }
        })
    
        signInBox.prop('onSubmit')(event);
    
        expect(wrapper.state('auth')).toBeTruthy();
    
        let appWrapper = wrapper.find(App)
        
        appWrapper.prop('logOut')();

        expect(wrapper.state('auth')).toBeFalsy();
    })
})
