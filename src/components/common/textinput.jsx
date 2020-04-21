import React from 'react';
import style from './style.css';

function TextInput(props) {
  const inputProps = {
    type: 'text',
    name: props.name,
    onChange: props.onChange,
    readOnly: props.readOnly
  };
  if (props.readOnly) inputProps.defaultValue = props.value;
  else inputProps.value = props.value;
  return (
    <div className={style.text_input}>
      {props.text} {props.children}
      <br />
      <input {...inputProps} />
    </div>
  );
}

export default TextInput;
