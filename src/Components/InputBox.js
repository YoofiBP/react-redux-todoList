import React from 'react';
import { connect } from 'react-redux';
import { addItem } from '../redux/actions';
//import { users } from '../users';

class InputBox extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value:""
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event){
        this.setState({value: event.target.value})
    }

    handleSubmit(event){
        if(this.state.value.length > 1){
        this.props.addNewTodo(this.state.value, this.props.currentDate)
        this.setState({value:""})
        }
        event.preventDefault();
    }

    render(){
    return (
        <div className="input-group mb-2">
            <form className="input-group mb-2 w-100" onSubmit={this.handleSubmit}>
  <input id="title" onChange={this.handleChange} type="text" className="form-control" value={this.state.value} placeholder="New Item" aria-label="New Item" aria-describedby="button-addon2"/>
  <input type="submit" className="btn btn-outline-secondary" value="Add Item" />
  </form>
</div>
    )
    }
}

export class Welcome extends React.Component{
    constructor(props){
        super(props);
        this.state = {user: {}}
    }

    componentDidMount() {
    fetch('/users.json')
    .then(res => res.json())
    .then(users => { return users.filter(user => user.userId === this.props.userId)})
    .then(user => this.setState({user: user[0]}))
    .catch(err => console.log(err))
    }

    render() {
        return (
            <h1>Welcome {this.state.user.username}!</h1>
        )
    }
    
}

const mapDispatchToProps = dispatch => {
    return {
        addNewTodo: (title, date) => {
            dispatch(addItem(title, date))
        }
    }
}

const mapStateToProps = state => {
    return {
        currentDate: state.date
    }
}   

export default connect(mapStateToProps, mapDispatchToProps)(InputBox);