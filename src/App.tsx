import React from 'react';
import { Switch, Route, Router, Redirect } from 'react-router-dom';
import history from './lib/history';
import Auth from './components/auth/Auth';
import SignIn from './components/auth/signin/SignIn';
import SignUp from './components/auth/signup/SignUp';
import Security from './components/auth/security/Security';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.css';

interface Props {};
interface State {};

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  render() {
    return(
      <Router history={history}>
        <Switch>

            <Route exact path='/'>
              <Redirect to='/signin' />
            </Route>

            <Route exact path='/signin' render={props =>
              <Auth
                title='Sign in to Internxt'
                internalForm={<SignIn />} 
                statusBtnSignIn='on'
                statusBtnSignUp='off'
                recoveryPasswordVisibility='visible'
              />} 
            />

            <Route exact path='/signup' render={props =>
              <Auth
                title='Create an Internxt account'
                internalForm={<SignUp />} 
                statusBtnSignIn='off'
                statusBtnSignUp='on'
                recoveryPasswordVisibility='invisible'
              />} 
            />

            <Route exact path='/recovery' render={props => ''} />

            <Route>
              <Redirect to='/signin' />
            </Route>

          </Switch>
      </Router>
    );
  }
}

export default App;
