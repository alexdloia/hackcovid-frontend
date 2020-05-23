import React from 'react';
import Header from './header.js';
import './Home.css';

export default function Home(props) {
  return (
    <div className="Home">
      <div className="home-part1">
        <Header selected="Home" />
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
          <h2>What we do</h2>
          <strong>One of the biggest bottlenecks in innovation and solution-finding is the difficulty in sourcing talented people to support these efforts. </strong>
          <p>Our mission is to connect teams across the globe who are working tirelessly to tackle the COVID-19 pandemic—whether that be by developing a new cost-effective design for a ventilator or a more efficient solution for contact tracing—with talented individuals who want to play an active role in this fight.</p>
          <p>Ultimately, we hope to live in a world where this site is no longer needed, thanks to incredible people like yourselves who have dedicated time and effort to a cause greater than any one of us… a COVID-free future.</p>
          <h2>Who we are</h2>
          <p>We are a group of students from Stanford University who want to help in the fight against COVID-19. We’ve experienced firsthand the difficulty of bringing together a team of talented individuals to bring our ideas to fruition. As students ourselves, we’ve also seen internships, jobs, and research positions cancelled, leaving plenty of talented people without opportunities to do something they’re passionate about.</p>
          <p>That’s why we started hackCOVID, where we hope we can bridge the gap between great ideas and even greater people.</p>
        </div>
      </div>
    </div>
  )
}
