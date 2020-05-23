import React from 'react';
import Header from './header.js';
import {Link} from 'react-router-dom';
import './Projects.css';

function Project(props) {
  return (
    <div className="project">
      <div className="project-img">
        <p className="project-desc">
          <br />
          {props.description}
          <br />
          <br />
          Tags: {props.tags.join(", ")}
          <br />
          <br />
          <Link to={`/project/${props.id}`}>More Info</Link>
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
    this.state = {key: props.search_key, loaded: false, ok: true, data: []};
  }

  get_content() {
    if (this.state.loaded) {
      return this.state.data.map(proj => (
        <Project name={proj.name} background={proj.background} description={proj.description} tags={proj.tags} id={proj.id} key={proj.id} />
      ));
    }
  }

  render() {
    if (this.state.loaded) {
      return (
        <div className="project-row-container">
          <p className="project-row-title">{this.props.friendly}</p>
          <div className="project-row">
            {this.get_content()}
          </div>
        </div>
      );
    }
    if (this.state.ok) {
      return (
        <div className="project-row-container">
          <p className="project-row-title">{this.props.friendly}</p>
          <div className="project-row">
            <h1>Loading...</h1>
          </div>
        </div>
      );
    }
    return (
      <div className="project-row-container">
        <p className="project-row-title">{this.props.friendly}</p>
        <div className="project-row">
          <h1>Something went wrong, try again.</h1>
        </div>
      </div>
    );
  }

  componentDidMount() {
	let approved_matched_projects = db.collections("projects")
		.where("category", "==", this.props.search_key)
		.where("approved", "==", true);

	approved_matched_projects.get()
		.then( (querySnapshot) => {	
			let data = []
			querySnapshot.foreach( (doc) => {
				data.push(doc.data());
			}	

			this.setState(Object.assign({}, this.state, {loaded: true}, {categories: data}));
		})
		.catch( (error) => {

		});
  }
}

export default class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loaded: false, ok: true};
  }

  componentDidMount() {
	let categories = db.collection("categories");
	categories.get()
		.then( (querySnapshot) => {
			let json = []
			querySnapshot.foreach( (doc) => {
				json.push({ key: doc.id, friendly: doc.data().friendly });
			}

			this.setState(Object.assign({}, this.state, {loaded: true}, {categories: json}));
		}
		.catch( (error) => {
			this.setState(Object.assign({}, this.state, {ok: false}));
		});
  }

  render() {
    if (this.state.loaded) {
      return (
        <div className="Projects">
          <Header selected="Projects"/>
          <div className="content">
            {this.state.categories.map(category => (
              <Row key={category.key} search_key={category.key} friendly={category.friendly} />
            ))}
          </div>
        </div>
      )
    } else {
      if (this.state.ok) {
        return (
          <div className="Projects">
            <Header selected="Projects"/>
            <div className="content">
              <h1>Loading...</h1>
            </div>
          </div>
        )
      } else {
        return (
          <div className="Projects">
            <Header selected="Projects"/>
            <div className="content">
              <h1>Something went wrong, try again</h1>
            </div>
          </div>
        )
      }
    }
  }
}
