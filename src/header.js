import React from 'react';
import {Link} from 'react-router-dom';
import './Header.css';

export default function Header(props) {
  const home = props.selected === "Home";
  return (
    <div className={home ? "home-header" : "header"}>
      <span className="header-logo"><span>hack</span><span>COVID</span></span>
      <nav className="header-links">
        <Link to="/" className={home ? "selected" : ""} >Home</Link>
        <Link to="/projects" className={props.selected === "Projects" ? "selected" : ""} >Projects</Link>
        <Link to="/post" className={props.selected === "Post" ? "selected" : ""}>Post a Job</Link>
      </nav>
    </div>
  );
}
