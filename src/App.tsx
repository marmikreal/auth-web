import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
// import Auth from './Auth/Auth';
import Auth from './components/auth/Auth';
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
        <BrowserRouter>
          <Switch>
            <Route exact path='/' render={() => <Auth />} />
            {/* <Route component={NotFound} /> */}
          </Switch>
        </BrowserRouter>
    );
  }
}

export default App;
