import React from 'react';
import {HomeHeader} from './header.js';
import './Home.css';

export default function Home(props) {
  return (
    <div className="Home">
      <div className="home-part1">
        <HomeHeader />
        <div className="content">
          <div className="headline">
            <h4>What we do?</h4>
            <h1>
              <span>We solve</span>
              <br />
              <span>big problems</span>
            </h1>
          </div>
        </div>
      </div>
      <div className="home-part2">
        <div className="content">
          <h4>Benefits</h4>
          <h2>What we do...</h2>
          <strong>Eget nunc scelerisque viverra mauris in aliquam. Dignissim sodales ut eu sem integer vitae. Libero nunc consequat interdum varius.</strong>
          <p>Magna sit amet purus gravida. Sit amet porttitor eget dolor morbi non.</p>
          <p>Lectus vestibulum mattis ullamcorper velit sed ullamcorper.</p>
          <p>Diam phasellus vestibulum lorem sed risus ultricies tristique nulla. Dui faucibus in ornare quam viverra.</p>
          <p>Posuere ac ut consequat semper viverra.</p>
        </div>
      </div>
    </div>
  )
}
