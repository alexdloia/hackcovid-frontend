import React from 'react';
import {Header} from './header.js';
import './Post.css';

function TextInput(props) {
  return (
    <label>
      {props.label}
      <br />
      <input type="text" name={props.name} placeholder={props.placeholder} />
    </label>
  );
}

function limitWords(to) {
  return (event) => {
    if (event.target.value.split(/\s/).length > 20) {
      event.target.classList.add("invalid");
    } else {
      event.target.classList.remove("invalid");
    }
  };

}

function Form(props) {
  return (
    <form method="post">
      <label>
        Contact Email
        <br />
        <input type="email" name="email" placeholder="contact email" />
      </label>
      <TextInput label="Project Title" name="title" placeholder="project title" />
      <label>
        Project Type
        <br />
        <select name="type">
          <optgroup label="Project Type">
            <option value="research">Research</option>
            <option value="app">App/Website</option>
            <option value="software">Software Solutions</option>
            <option value="hardware">Hardware Solutions</option>
            <option value="other">Other</option>
          </optgroup>
        </select>
      </label>
      <TextInput label="What You're Looking For" name="looking" placeholder="qualifications" />
      <label>
        Requested Materials
        <br />
        <textarea name="materials" placeholder="Note: separate entries with commas Ex: Resume, Certifications, Portfolio" />
      </label>
      <TextInput label="Location" name="location" placeholder="city and country" />
      <label>
        Project Preview
        <br />
        <input type="text"
          name="preview"
          placeholder="20 word project summary"
          onChange={limitWords(20)}
        />
      </label>
      <label>
        Project/Team Description
        <br />
        <textarea name="team_description" placeholder="Describe your team and the project you’re working on" />
      </label>
      <label>
        Position Description
        <br />
        <textarea
          name="position_description"
          placeholder="Describe what the position involves (300 words max)"
          onChange={limitWords(300)}
        />
      </label>
      <label>
        Is this position remote?
        <input type="checkbox" name="remote" />
      </label>
      <label>
        Upload a Preview Image (optional)
        <input type="file" accept="image/*" />
      </label>
      <div className="submit">
        <input type="submit" value="Submit" />
      </div>
    </form>
  )
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