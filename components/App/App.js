import React from 'react';
import styles from './App.module.scss';
import {
  Router,
  Switch,
  Route
} from "react-router-dom";

// Components
import MainContainer from '../Main/MainContainer';
import SubscribeContainer from '../Subscribe/SubscribeContainer';
import Login from '../Login/Login';
import SearchContainer from '../Search/SearchContainer';

// Utility Functions


export default function App({}) {
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/search">
            <SearchContainer />
          </Route>
          <Route path="/">
            <SearchContainer />
          </Route>
        </Switch>
      </Router>
    </div>

  )
}
