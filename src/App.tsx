import React from 'react';
import { Switch, Route, Router, Redirect } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import events from './lib/pubsub';
import Auth from './components/Auth';
import SignIn from './components/signin/SignIn';
import SignUp from './components/signup/SignUp';
import Recovery from './components/recovery/Recovery';
import history from './lib/history';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.css';

interface Props {};
interface State {
  showRecoveryStep: string
  isAuthenticated: Boolean
};

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showRecoveryStep: 'invisible',
      isAuthenticated: false
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
          <div className="__auth-container">
            
            <Router history={history}>
              <Switch>    
                  <Route exact path='/login' render={props =>
                    <Auth internalForm={<SignIn isAuthenticated={this.state.isAuthenticated} />}
                  />} />
                  
                  <Route exact path='/new' render={props =>
                    <Auth internalForm={<SignUp />}
                  />} />

                  <Route exact path='/recovery' render={props => <Recovery />} />

                  <Route exact path='/'><Redirect to='/login' /></Route>
                  <Route path="*"><Redirect to='/login' /></Route>
                  
              </Switch>
            </Router>
          </div>

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
