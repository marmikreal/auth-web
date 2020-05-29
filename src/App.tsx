import React from 'react';
import { Switch, Route, Router, Redirect } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import events from './lib/pubsub';
import history from './lib/history';
import Auth from './components/auth/Auth';
import SignIn from './components/auth/signin/SignIn';
import SignUp from './components/auth/signup/SignUp';
import Recovery from './components/auth/recovery/Recovery';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.css';

interface Props {};
interface State {
  showRecoveryStep: string
};

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showRecoveryStep: 'invisible'
    };
  }

  componentWillMount() {
    events.subscribe('/show/recovery', (visibility: string) => {
      this.setState({
        showRecoveryStep: visibility
      });
    })
  }

  render() {
    return(
      <Container fluid className="__auth-main-container">
        <div className="__auth-container-sections .animated .fadeInLeft">
          <Router history={history}>
            <Switch>

                <div className="__auth-container">
                  <Route exact path='/'><Redirect to='/signin' /></Route>

                  <Route exact path='/signin' render={props =>
                    <Auth internalForm={<SignIn />}
                  />} />

                  <Route exact path='/signup' render={props =>
                    <Auth internalForm={<SignUp />}
                  />} />

                  <Route exact path='/recovery' render={props => <Recovery />} />
                  <Route><Redirect to='/signin' /></Route>
                </div>

            </Switch>
          </Router>

          <div className={this.state.showRecoveryStep} onClick={(e: any) => {
            e.preventDefault();
            history.push('/recovery');
          }}>Forgot your password?</div>

        </div>
      </Container>
    );
  }
}

export default App;
