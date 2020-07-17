import React, {Suspense} from "react";
import ReactDOM from "react-dom";
import { SignIn } from "./Components/Login";
//import {users} from '../users';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as serviceWorker from './serviceWorker';
import { App } from "./App";
import { Provider } from 'react-redux';
import { store } from './redux/store';
//const App = React.lazy(() => import('./App'));

export class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      auth: false,
      email: "",
      password: "",
      hasError: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  componentDidCatch(error, info){
    this.setState({hasError: true});
    console.log(info, error);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    const users = [
      {
        userId: 1,
        username: "Yoofi",
        email: "joseph.brown-pobee@ashesi.edu.gh",
        password: "qwerty123"
      },
      {
        userId: 2,
        username: "Effie",
        email: "effie@kpmg.com",
        password: "kpmg1234"
      }
    ];
    let inputEmail = this.state.email;
    let inputPassword = this.state.password;
    let login = users.filter(
      user => inputEmail === user.email && inputPassword === user.password
    );
    login.length > 0
      ? this.setState({ auth: true, userId: login[0].userId, email: "", password: "" })
      : alert("Wrong Credentials");
    event.preventDefault();
  }

  logOut() {
      this.setState({auth: false})
  }

  render() {
    if(this.state.hasError){
      return <h1>Whoops Sorry!</h1>
    }else{
    let loggedIn = this.state.auth;
    let user = this.state.userId;
    return <div><Provider store={store}><App userId={user} logOut={this.logOut}/></Provider></div>
    }
    /*
    return loggedIn ? (
      <div><Provider store={store}><App userId={user} logOut={this.logOut}/></Provider></div>
      // <div><Suspense fallback={<CircularProgress />}><App userId={user} logOut={this.logOut}/></Suspense></div>
    ) : (
      <SignIn onChange={this.handleChange} onSubmit={this.handleSubmit} />
    );*/
  }

}
ReactDOM.render(<Index />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
