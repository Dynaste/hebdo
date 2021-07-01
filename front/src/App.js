import React from 'react';
import LoginView from './views/LoginView';
import SignupView from './views/SignupVIew';
import Home from './views/Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
            </Switch>
            <Switch>
                <Route path="/login">
                    <LoginView />
                </Route>
            </Switch>
            <Switch>
                <Route path="/signup">
                    <SignupView />
                </Route>
            </Switch>
        </Router>
    );
};

export default App;
