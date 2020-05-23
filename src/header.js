import React from 'react';
import {Link} from 'react-router-dom';
import './Header.css';

export function HomeHeader(props) {
  return (
    <div className="home-header">
      <span className="header-logo"><span>hack</span><span>COVID</span></span>
      <nav className="header-links">
        <Link to="/" className="selected">Home</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/join">Join as a Team</Link>
      </nav>
    </div>
  );
}

export function Header(props) {
  return (
    <div className="header">
      <span className="header-logo"><span>hack</span><span>COVID</span></span>
      <nav className="header-links">
        <a href="/" className={props.selected === "Home" ? "selected" : ""} >Home</a>
        <a href="/projects" className={props.selected === "Projects" ? "selected" : ""} >Projects</a>
        <a href="/join" className={props.selected === "Join" ? "selected" : ""}>Join as a Team</a>
      </nav>
    </div>
  );
}
