import React from 'react';
import {Header} from './header.js';
import {Link} from 'react-router-dom';
import './Project.css';

function SidePanel(props) {
  return (
    <div className="project-right">
      <strong>Looking For</strong>
      <p>{props.looking}</p>
      <strong>Requested Materials</strong>
      <ul>
        {props.requested.map((material, i) => (
          <li key={i}>{material}</li>
        ))}
      </ul>
      <p className="project-contact">
        <button className="project-contact">
          <a href={props.contact}>Contact Team</a>
        </button>
      </p>
    </div>
  );
}

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loaded: false};
  }

  render() {
    if (!this.state.loaded) {
      return (
        <div className="Project">
          <Header />
          <h1>Loading</h1>
        </div>
      );
    } else {
      return (
        <div className="Project">
          <Header />
          <h1>{this.state.position}</h1>
          <p className="project-loc">{this.state.location}</p>
          <div className="project-left">
            <SidePanel looking={this.state.looking} requested={this.state.requested} contact={this.state.contact} />
          </div>
          <p><strong>Location:</strong> {this.state.location}</p>
          <p><strong>Remote:</strong> {this.state.remote ? "yes" : "no"}</p>
          <strong>Team/Project Description</strong>
          <p>{this.state.project_desc}</p>
          <strong>Position Description</strong>
          <p>{this.state.position_desc}</p>
        </div>
      )
    }
  }

  componentDidMount() {
    // TODO: fetch
    this.setState(Object.assign({}, this.state, {
      name: "Johns Hopkins World Map",
      position: "Data Aggregation Specialist",
      location: "Baltimore, Maryland",
      position_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi efficitur arcu non leo scelerisque commodo. Praesent elementum tellus ipsum, in feugiat turpis condimentum vitae. Proin a nisl non mi aliquam vulputate vel nec felis. Nulla ex diam, molestie a tortor vehicula, pellentesque consequat elit. Morbi ut sapien nec elit facilisis vulputate ac sed ante. Nulla elementum, nibh sed gravida faucibus, mi tortor iaculis risus, non pellentesque tortor metus sed ligula. Aliquam pharetra ornare hendrerit. In at purus metus. Suspendisse malesuada nulla et nibh molestie, vel hendrerit dui convallis.",
      project_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi efficitur arcu non leo scelerisque commodo. Praesent elementum tellus ipsum, in feugiat turpis condimentum vitae. Proin a nisl non mi aliquam vulputate vel nec felis. Nulla ex diam, molestie a tortor vehicula, pellentesque consequat elit. Morbi ut sapien nec elit facilisis vulputate ac sed ante. Nulla elementum, nibh sed gravida faucibus, mi tortor iaculis risus, non pellentesque tortor metus sed ligula. Aliquam pharetra ornare hendrerit. In at purus metus. Suspendisse malesuada nulla et nibh molestie, vel hendrerit dui convallis.",
      looking: "We’re looking for front end developers experienced with React.",
      remote: true,
      requested: ["Resume/CV", "Portfolio (optional)"],
      contact: "https://example.com",
      loaded: true
    }));
  }
}

export default Project;
