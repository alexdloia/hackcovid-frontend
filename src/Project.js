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
      <div className="project-right-inner">
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
    </div>
  );
}

function ModalNotification(props) {
  return (
    <div className={"notification-holder"}>
      <div className={"notification " + props.state}>
        <span>{props.message}</span>
        <span onClick={() => props.clearNotification()}>✕</span>
      </div>
    </div>
  )
}

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listener: this.keyDown.bind(this),
      verified: false,
      notification: {active: false, message: "", state: ""},
    }
  }

  componentDidMount() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptchaDiv', {
      'callback': (token) => {
        try {
          this.setState({verified: true});
          console.log(token);
        } catch(err) {
          console.log(err);
        }
      }
    });

    window.recaptchaVerifier.render().then(function(widgetId) {
      window.recaptchaWidgetId = widgetId;
      console.log(widgetId);
    });

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

  setNotification(state) {
    let notification;
    switch (state) {
      case "pending":
        notification = {active: true, message: "Submitting response...", state: "pending"};
        break;
      case "ok":
        notification = {active: true, message: "Response submitted.", state: "ok"};
        break;
      case "error":
        notification = {active: true, message: "An error occurred.", state: "error"};
        break;
      case "none":
      default:
        notification = {active: false, message: "", state: ""};
        break;
    }
    this.setState(Object.assign({}, this.state, {notification: notification}));
  }

  render() {
    return (
      <div className="modal"
        onClick={() => this.props.exit()}
        onScroll={event => event.stopPropagation()}
      >
        <div className="modal-content Post" onClick={event => event.stopPropagation()}>
          <div className="modal-close" onClick={() => this.props.exit()}>✕</div>
          {
            this.state.notification.active && 
            <ModalNotification
              message = {this.state.notification.message}
              state = {this.state.notification.state}
              clearNotification = {() => (
                this.setNotification("none")
              )}
            />
          }
          <form method="post" id="modal-form">
            <h1>Get in touch with {this.props.team}</h1>
            <p>Please fill out the form below, and this team will be in touch!</p>
            <TextInput name="name" placeholder="Your name" label="Your Name" />
            <label>
              Email
              <br />
              <p>Your email</p>
              <input type="email" name="user_email" placeholder=" " required />
            </label>
            <label>
              Message To Team
              <br />
              <p>Describe your interests, qualifications, and any other information you’d like the team to know (400 word max)</p>
              <textarea
                name="message"
                onChange={limitWords(400)}
                placeholder=" "
                required
              />
            </label>
            <label>
              Upload Files
              <Requested requested={this.props.requested} />
              <input id="requestedFiles" type="file" multiple placeholder=" " />
            </label>
            <div id="recaptchaDiv" class="g-recaptcha"></div>
            <div className="submit">
              <input
                type="submit"
                value="Submit"
                onClick={(event) => {
                  event.preventDefault();
                  if (!this.state.verified) {
                      console.log("not verified");
                      return;
                  }
                  let form_data = new FormData(document.getElementById("modal-form"));
                  form_data.append("team_email", this.props.email);
                  Array.from(document.getElementById("requestedFiles").files).forEach( (file, i) => {
                    console.log(file);
                    form_data.append("file" + i, file);
                  });

                  this.setNotification("pending");
                  fetch("/contact", {
                    method: 'POST',
                    body: form_data
                  }).then(response => {
                    console.log(response);
                    if (response.ok) {
                      this.setNotification("ok");
                    } else {
                      this.setNotification("error");
                    }
                  }).catch(error => {
                    this.setNotification("error");
                  });
                }
              }
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
        team={this.state.title}
        exit={() => this.setModal(false)}
        requested={this.state.requested}
        email={this.state.email}
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
            <p><strong>Location:</strong> {this.state.location}</p>
            <p><strong>Remote:</strong> {this.state.remote ? "Yes" : "No"}</p>
            <strong>Team/Project Description</strong>
            <p>{this.state.team_desc}</p>
            <strong>Position Description</strong>
            <p>{this.state.pos_desc}</p>
            {this.renderModal()}
          </div>
        </div>
      )
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    db.collection("projects").where("id","==",id).get()
      .then(querySnapshot => (
        querySnapshot.forEach(doc => {
          console.log(doc.data());
          this.setState(Object.assign({}, this.state, {loaded: true}, doc.data()));
        })
      ))
      .catch(error => {
        console.log(error);
        this.setState(Object.assign({}, this.state, {ok: false}));
      });
  }
}

export default withRouter(Project);
