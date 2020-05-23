import React from 'react';
import logo from './logo.svg';
import './App.css';
import './Color.css';
import Home from './Home.js';
import Projects from './Projects.js';
import Project from './Project.js';
import Post from './Post.js';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {posts: [{"name": "Team1", "desc": "We are a team", "id": 1}, {"name": "Team2", "desc": "We are also a team", "id": 3}]};
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/post">
            <Post />
          </Route>
          <Route path="/projects">
            <Projects />
          </Route>
          <Route path="/project/:id">
            <Project />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default App;
