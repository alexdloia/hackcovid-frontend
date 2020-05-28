import React from 'react';

export function TextInput(props) {
  if (props.optional) {
    return (
      <label>
        {props.label}
        <br />
        <p>{props.placeholder}</p>
        <input type="text" name={props.name} placeholder=" " />
      </label>
    );
  } else {
    return (
      <label>
        {props.label}
        <br />
        <p>{props.placeholder}</p>
        <input required type="text" name={props.name} placeholder=" " />
      </label>
    );
  }
}

export function limitWords(to) {
  return (event) => {
    if (event.target.value.split(/\s/).length > to) {
      event.target.classList.add("invalid");
    } else {
      event.target.classList.remove("invalid");
    }
  };
}
