import React from 'react';
import {TextInput, limitWords} from './form.js';
import Header from './header.js';
import {Link, useParams, withRouter} from 'react-router-dom';
import './Project.css';
import firebase from './firebase.js';

var db = firebase.firestore();

function Requested(props) {
  return (
    <ul>
      {props.requested.map((material, i) => (
        <li key={i}>{material}</li>
      ))}
    </ul>
  );
}

function SidePanel(props) {
  return (
    <div className="project-right">
      <strong>Looking For</strong>
      <p>{props.looking}</p>
      <strong>Requested Materials</strong>
      <Requested requested={props.requested} />
      <p className="project-contact">
        <button className="project-contact" onClick={() => props.contact()} >
          Contact Team
        </button>
      </p>
    </div>
  );
}

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {listener: this.keyDown.bind(this)};
  }

  componentDidMount() {
    window.addEventListener("keydown", this.state.listener);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.state.listener);
  }

  keyDown(event) {
    if (event.which === 27) {
      this.props.exit();
    }
  }

  render() {
    return (
      <div className="modal"
        onClick={() => this.props.exit()}
        onScroll={event => event.stopPropagation()}
      >
        <div className="modal-content Post" onClick={event => event.stopPropagation()}>
          <form method="post" id="modal-form">
            <h1>Get in touch with {this.props.team_name}</h1>
            <p>Please fill out the form below, and this team will be in touch!</p>
            <TextInput name="name" placeholder="your name" label="Your Name" />
            <label>
              Email
              <br />
              <input type="email" name="email" placeholder="your email" required />
            </label>
            <label>
              Message To Team
              <br />
              <textarea
                name="message"
                placeholder="Describe your interests, qualifications, and any other information you’d like the team to know (400 word max)"
                onChange={limitWords(400)}
                required
              />
            </label>
            <label>
              Upload Files
              <Requested requested={this.props.requested} />
              <input type="file" multiple />
            </label>
            <div className="submit">
              <input
                type="submit"
                value="Submit"
                onClick={(event) => {
                  event.preventDefault();
                  const form_data = new FormData(document.getElementById("modal-form"));
                  fetch("/apply", {
                    method: 'POST',
                    body: form_data
                  }).then(response => {
                    if (response.ok) {
                      this.props.exit();
                    }
                  });
                }}
              />
            </div>
          </form>
        </div>
      </div>
    )
  }
}

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loaded: false, in_modal: false, ok: true};
  }

  setModal(to) {
    this.setState(Object.assign({}, this.state, {in_modal: to}));
  }

  renderModal() {
    if (this.state.in_modal) {
      return <Modal
        team={this.state.name}
        exit={() => this.setModal(false)}
        requested={this.state.requested}
      />
    }
  }

  render() {
    if (!this.state.loaded) {
      if (this.state.ok) {
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
            <h1>Something went wrong, try again</h1>
          </div>
        );
      }
    } else {
      return (
        <div className="Project">
          <Header />
          <h1>{this.state.title}</h1>
          <p className="project-loc">
		    {this.state.pos_title} <br />
			<small className="project-loc">({this.state.team_name})</small>
          </p>
          <div className="project-left">
            <SidePanel looking={this.state.looking} requested={this.state.requested}
              contact={() => this.setModal(true)}
            />
          </div>
          <p><strong>Location:</strong> {this.state.location}</p>
          <p><strong>Remote:</strong> {this.state.remote ? "Yes" : "No"}</p>
          <strong>Team/Project Description</strong>
          <p>{this.state.proj_desc}</p>
          <strong>Position Description</strong>
          <p>{this.state.pos_desc}</p>
		  <img src={this.state.imageUrl} />
          {this.renderModal()}
        </div>
      )
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id;
	db.collection("projects").where("id","==",id).get()
		.then( (querySnapshot) => {
			querySnapshot.forEach( (doc) => {
				 console.log(doc.data());
				 this.setState(Object.assign({}, this.state, {loaded: true}, doc.data()));
			});	
		})
		.catch( (error) => {
			console.log(error);
			this.setState(Object.assign({}, this.state, {ok: false}));
		});
  }
}

export default withRouter(Project);
