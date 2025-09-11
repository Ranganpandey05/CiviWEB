import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Reports from './pages/reports';
import Workers from './pages/workers';
import Analytics from './pages/analytics';
import './styles/globals.css';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Dashboard} />
                <Route path="/reports" component={Reports} />
                <Route path="/workers" component={Workers} />
                <Route path="/analytics" component={Analytics} />
            </Switch>
        </Router>
    );
};

export default App;