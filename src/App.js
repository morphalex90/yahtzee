import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from './components/Pages/Home';
import Session from './components/Pages/Session';
import About from './components/Pages/About';
import Rules from './components/Pages/Rules';


function App() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/about" component={About} />
          <Route path="/rules" component={Rules} />
          <Route path="/session/:session" component={Session} />
          <Route component={Error} />
        </Switch>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
