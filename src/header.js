import React from 'react';
import {Link} from 'react-router-dom';
import './Header.css';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {fixed: false, scroll: this.scroll.bind(this)};
  }

  componentDidMount() {
    window.addEventListener("scroll", this.state.scroll);
    this.state.scroll();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.state.scroll);
  }

  scroll() {
    const header = document.getElementById("header");
    let fixed = false;
    if (this.props.selected === "Home") {
      fixed = window.scrollY > header.clientHeight;
    } else {
      fixed = window.scrollY > header.offsetTop;
    }
    if (fixed) {
      if (!this.state.fixed) {
      document.getElementById("header-container").style.height = header.clientHeight + "px";
        this.setState(Object.assign({}, this.state, {fixed: true}));
      }
    } else {
      this.setState(Object.assign({}, this.state, {fixed: false}));
    }
  }

  render() {
    const home = this.props.selected === "Home";
    return (
      <div id="header-container">
        <div className={this.state.fixed ? "header fixed" : home ? "home-header" : "header"} id="header">
          <span className="header-logo"><span>hack</span><span>COVID</span></span>
          <nav className="header-links">
            <Link to="/" className={home ? "selected" : ""} >Home</Link>
            <Link to="/projects" className={this.props.selected === "Projects" ? "selected" : ""} >Projects</Link>
            <Link to="/post" className={this.props.selected === "Post" ? "selected" : ""}>Post a Position</Link>
          </nav>
        </div>
      </div>
    );
  }
}
