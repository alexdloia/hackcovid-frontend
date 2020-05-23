import React from 'react';
import {TextInput, limitWords} from './form.js';
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
    document.body.addEventListener("keydown", this.state.listener);
  }

  componentWillUnmount() {
    document.body.removeEventListener("keydown", this.state.listener);
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
            <h1>Get in touch with {this.props.team}</h1>
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
    this.state = {loaded: false, in_modal: false};
  }

  setModal(to) {
    this.setState(Object.assign({}, this.state, {in_modal: to}));
  }

  renderModal() {
    if (this.state.in_modal) {
      return <Modal
        team={this.state.name}
        exit={() => this.setModal(false)}
      />
    }
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
          <h1>{this.state.name}</h1>
          <p className="project-loc">{this.state.position}</p>
          <div className="project-left">
            <SidePanel looking={this.state.looking} requested={this.state.requested}
              contact={() => this.setModal(true)}
            />
          </div>
          <p><strong>Location:</strong> {this.state.location}</p>
          <p><strong>Remote:</strong> {this.state.remote ? "yes" : "no"}</p>
          <strong>Team/Project Description</strong>
          <p>{this.state.project_desc}</p>
          <strong>Position Description</strong>
          <p>{this.state.position_desc}</p>
          {this.renderModal()}
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
