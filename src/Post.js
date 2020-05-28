import React from 'react';
import Header from './header.js';
import {TextInput, limitWords} from './form.js';
import './Post.css';
import firebase from './firebase.js';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = { verified: false };
  }

  componentDidMount() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('projRecaptchaDiv', {
      'callback': (token) => {
        try {
          this.setState({verified: true});
          document.getElementById("formSubmit").disabled = false;
          console.log(token);
        } catch(err) {
          console.log(err);
        }
      },
      'expired_callback': () => { 
        this.setState({verified: false});
        document.getElementById("formSubmit").disabled = true;
      }
    });
    window.recaptchaVerifier.render().then(function(widgetId) {
      window.recaptchaWidgetId = widgetId;
      console.log(widgetId);
    });
  }

  render() {
    return (
      <form method="post" action="/post_position" encType='multipart/form-data'>
        <div className="post-twocol">
          <div className="post-left">
            <label>
              Contact Email
              <br />
              <input type="email" name="email" placeholder="Contact email" required />
            </label>
            <TextInput label="Project Title" name="title" placeholder="Name of your project" />
            <TextInput label="Team Name" name="team_name" placeholder="Name of your team" />
            <TextInput label="Position Title" name="pos_title" placeholder="Title of open role" />
            <label>
              Project Type
              <br />
              <select name="category" required>
                <optgroup label="Project Type">
                  <option value="research">Research</option>
                  <option value="app">App/Website</option>
                  <option value="software">Software Solutions</option>
                  <option value="hardware">Hardware Solutions</option>
                  <option value="other">Other</option>
                </optgroup>
              </select>
            </label>
            <TextInput optional={true} label="Project Type" name="type_details" placeholder="if other" required />
            <TextInput label="What You're Looking For" name="looking" placeholder="qualifications" required />
            <label>
              Requested Materials
              <br />
              <textarea name="requested" placeholder="Note: separate entries with commas Ex: Resume, Certifications, Portfolio" required />
            </label>
            <TextInput label="Location" name="location" placeholder="City, State/Province, country" />
            <label>
              Project Preview
              <br />
              <input type="text"
                name="summary"
                placeholder="20 word project summary"
                onChange={limitWords(20)}
                required
              />
            </label>
          </div>
          <div className="post-right">
            <label>
              Project/Team Description
              <br />
              <textarea required name="team_desc" placeholder="Describe your team and the project you’re working on" />
            </label>
            <label>
              Position Description
              <br />
              <textarea
                name="pos_desc"
                placeholder="Describe what the position involves (300 words max)"
                onChange={limitWords(300)}
                required
              />
            </label>
          </div>
        </div>
        <label>
          Is this position remote?
          <input type="checkbox" name="remote" />
        </label>
        <label>
          Upload a Preview Image (optional)
          <input type="file" accept="image/*" name="project_image" />
        </label>
        <div id="projRecaptchaDiv"></div>
        <div className="submit">
          <input type="submit" value="Submit" id="formSubmit" disabled />
        </div>
      </form>
    )
  }
}

export default function Post(props) {
  return (
    <div className="Post">
      <Header selected="Post" />
      <div className="content">
        <h1>Join our growing community of teams</h1>
        <p>Please enter your team and project information below. We will briefly review submissions, and your project will be posted if your team is approved! Scroll to the bottom of this page for a sample job posting.</p>
        <Form />
      </div>
    </div>
  );
}
