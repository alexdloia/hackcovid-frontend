import React from 'react';
import {Header} from './header.js';
import './Projects.css';

function Project(props) {
  return (
    <div className="project">
      <div className="project-img">
        <p className="project-desc">
          <br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi efficitur arcu non leo scelerisque commodo. Praesent elementum tellus ipsum, in feugiat turpis condimentum vitae. Proin a nisl non mi aliquam vulputate vel nec felis.
        </p>
        <img src={`/projects/${props.background}`} />
      </div>
      <p className="project-name">{props.name}</p>
    </div>
  )
}

class Row extends React.Component {
  constructor(props) {
    super(props);
    this.state = {key: props.search_key, loaded: false, data: []};
  }

  get_content() {
    if (this.state.loaded) {
      return this.state.data.map(proj => (
        <Project name={proj.name} background={proj.background} description={proj.description} key={proj.key} />
      ));
    }
  }

  render() {
    return (
      <div className="project-row-container">
        <p className="project-row-title">{this.props.friendly}</p>
        <div className="project-row">
          {this.get_content()}
        </div>
      </div>
    );
  }

  componentDidMount() {
    /* TODO: fetch */
    this.setState(Object.assign({}, this.state, {
      data: [
        {name: "Johns Hopkins World Map", background: "jhopkins.png", description: "We are working on a comprehensive world map detailing global coronavirus cases by country.", tags: ["graphic designer"], key: "jhopkins"},
        {name: "Stanford COVID-Data", background: "stanford.png", description: "Stanford", tags: [], key: "stanford"},
        {name: "The Contact Tracing Team", background: "contact.png", description: "Contact", tags: [], key: "contact"},
        {name: "Stanford COVID-Teams", tags: [], background: "stanford.png", description: "Stanford", key: "stanford_teams"},
        {name: "Overflow", tags: [], background: "stanford.png", description: "Overflow", key: "overflow"},
        {name: "Overflow2", tags: [], background: "stanford.png", description: "Overflow2", key: "overflow2"},
      ],
      loaded: true
    }));
  }
}

export default function Projects(props) {
  return (
    <div className="Projects">
      <Header selected="Projects"/>
      <div className="content">
        <Row search_key="data-science" friendly="Data Science" />
        <Row search_key="ventilators" friendly="Ventilators" />
      </div>
    </div>
  )
}
