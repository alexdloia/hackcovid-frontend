import React from 'react';
import {HomeHeader} from './header.js';
import './Home.css';

export default function Home(props) {
  return (
    <div className="Home">
      <HomeHeader />
      <div className="content">
        <div className="headline">
          <h4>What we do?</h4>
          <h1 className="alt-color">
            <span>We solve</span>
            <br />
            <span>big problems</span>
          </h1>
        </div>
      </div>
    </div>
  )
}
